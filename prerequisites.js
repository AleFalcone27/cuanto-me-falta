(function(root){
  'use strict';
  const codeOf=text=>String(text||'').match(/\(([^()]+)\)\s*$/)?.[1]||null;
  function readRow(row){
    const code=codeOf(row.cells[0]?.textContent);
    const link=row.querySelector('.ver_correlatividades');
    const detail=row.nextElementSibling;
    const state=!link?'not-listed':link.dataset.completo==='true'?'loaded':'unloaded';
    const groups=mode=>Array.from(detail?.querySelectorAll(`table[summary="Opción para ${mode}"]`)||[]).map((table,i)=>({option:i+1,requirements:Array.from(table.rows).filter(r=>r.querySelector('td')).map(r=>({text:r.cells[0]?.textContent.trim()||'',condition:r.cells[1]?.textContent.trim()||''}))}));
    return {code,state,cursar:groups('cursar'),aprobar:groups('aprobar')};
  }
  function neighbors(data,selected,mode){
    const record=data.find(r=>r.code===selected);
    const options=record?.[mode]||[];
    const incoming=new Map();
    for(const option of options)for(const r of option.requirements){const code=codeOf(r.text);if(!code)continue;const current=incoming.get(code)||{code,conditions:[],options:[]};if(!current.conditions.includes(r.condition))current.conditions.push(r.condition);if(!current.options.includes(option.option))current.options.push(option.option);incoming.set(code,current);}
    const outgoing=[];
    for(const r of data){if(r.state!=='loaded')continue;const requirements=(r[mode]||[]).flatMap(o=>o.requirements).filter(req=>codeOf(req.text)===selected);if(requirements.length)outgoing.push({code:r.code,conditions:[...new Set(requirements.map(req=>req.condition))]});}
    return {record,options,incoming:[...incoming.values()],outgoing};
  }
  function overviewGraph(courses,data,mode){
    const primary=courses.filter(c=>c.entrance||c.year),seminars=courses.filter(c=>!c.entrance&&!c.year);
    const keys=[...new Set(primary.map(c=>c.entrance?'ingreso':String(c.year)))].sort((a,b)=>(a==='ingreso'?0:Number(a))-(b==='ingreso'?0:Number(b)));
    const columns=[],nodes=[],sections=[];
    keys.forEach((key,i)=>{const x=24+i*300;const group=primary.filter(c=>(c.entrance?'ingreso':String(c.year))===key).sort((a,b)=>a.semester-b.semester||a.code.localeCompare(b.code));let y=62,lastSemester=null;const periods=[];for(const c of group){if(c.year&&c.semester!==lastSemester){periods.push({label:`${c.semester}° cuatrimestre`,y});y+=25;lastSemester=c.semester;}nodes.push({code:c.code,x,y,width:230,height:108});y+=144;}columns.push({key,title:key==='ingreso'?'Ingreso':`${key}° año`,x,periods});});
    const mainHeight=Math.max(240,...nodes.map(n=>n.y+n.height+24));
    if(seminars.length){const entranceCodes=new Set(primary.filter(c=>c.entrance).map(c=>c.code)),entranceBottom=Math.max(60,...nodes.filter(n=>entranceCodes.has(n.code)).map(n=>n.y+n.height));const sectionHeight=seminars.length*144+64,sectionY=Math.max(entranceBottom+52,mainHeight-sectionHeight);sections.push({id:'seminars',title:'Seminarios',subtitle:'Sin año asignado',x:8,y:sectionY,width:262,height:sectionHeight});seminars.forEach((c,i)=>nodes.push({code:c.code,x:24,y:sectionY+72+i*144,width:230,height:108,section:'seminars'}));}
    const known=new Set(courses.map(c=>c.code)),edges=new Map();
    for(const target of data){if(target.state!=='loaded'||!known.has(target.code))continue;for(const option of target[mode]||[])for(const r of option.requirements){const from=codeOf(r.text);if(!known.has(from))continue;const key=from+'>'+target.code;const e=edges.get(key)||{from,to:target.code,conditions:[],options:[]};if(!e.conditions.includes(r.condition))e.conditions.push(r.condition);if(!e.options.includes(option.option))e.options.push(option.option);edges.set(key,e);}}
    return {columns,sections,nodes,edges:[...edges.values()],width:Math.max(278,keys.length*300-22),height:Math.max(240,...nodes.map(n=>n.y+n.height+24),...sections.map(section=>section.y+section.height+8))};
  }
  function routeEdge(a,b,ports={}){
    const cyA=ports.fromY??a.y+a.height/2,cyB=ports.toY??b.y+b.height/2;
    const sameColumn=a.x===b.x,forward=b.x>a.x,sourceRight=sameColumn||forward,targetRight=sameColumn||!forward;
    const start=sourceRight?a.x+a.width+2:a.x-2,end=targetRight?b.x+b.width+6:b.x-6;
    const sourceStub=start+(sourceRight?4:-4),targetStub=end+(targetRight?10:-10);
    const lane=sameColumn?Math.max(sourceStub,targetStub)+6:(sourceStub+targetStub)/2;
    return {path:`M ${start} ${cyA} L ${sourceStub} ${cyA} C ${lane} ${cyA}, ${lane} ${cyB}, ${targetStub} ${cyB} L ${end} ${cyB}`,from:{x:start,y:cyA},to:{x:end,y:cyB},targetStub:{x:targetStub,y:cyB},targetSide:targetRight?'right':'left'};
  }
  function routedEdges(model){
    const positions=new Map(model.nodes.map(n=>[n.code,n])),slots=model.edges.map(()=>({})),groups=new Map();
    function add(key,entry){if(!groups.has(key))groups.set(key,[]);groups.get(key).push(entry);}
    model.edges.forEach((e,i)=>{const a=positions.get(e.from),b=positions.get(e.to),same=a.x===b.x,forward=b.x>a.x;add(e.from+':'+(same||forward?'right':'left'),{i,role:'fromY',node:a,otherY:b.y+b.height/2});add(e.to+':'+(same||!forward?'right':'left'),{i,role:'toY',node:b,otherY:a.y+a.height/2});});
    for(const entries of groups.values()){entries.sort((a,b)=>a.otherY-b.otherY||a.i-b.i||a.role.localeCompare(b.role));entries.forEach((e,i)=>{slots[e.i][e.role]=e.node.y+16+(e.node.height-32)*(i+1)/(entries.length+1);});}
    return model.edges.map((e,i)=>({...e,geometry:routeEdge(positions.get(e.from),positions.get(e.to),slots[i])}));
  }
  root.UnlaPrereq={codeOf,readRow,neighbors,overviewGraph,routeEdge,routedEdges};
  if(typeof module!=='undefined')module.exports=root.UnlaPrereq;
})(typeof window!=='undefined'?window:globalThis);
