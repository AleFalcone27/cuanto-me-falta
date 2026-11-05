(function(root){
  'use strict';
  const norm = s => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const labels={passed:'Aprobada',taking:'En curso',pending:'Pendiente',other:'Revisar estado'};
  function status(grade,origin){
    const text=norm(`${grade} ${origin}`);
    if(/desaprob|reprob|ausente/.test(text)) return 'pending';
    if(/aprobado|aprobada|promocionado|promocionada|equivalencia/.test(text)) return 'passed';
    if(/en curso|cursando/.test(text)) return 'taking';
    return text.trim() ? 'other' : 'pending';
  }
  function parse(rows){
    const seen=new Set();
    return rows.flatMap(c=>{
      const match=(c[0]||'').match(/^(.*?)\s*\(([^()]+)\)\s*$/);
      if(!match || seen.has(match[2])) return [];
      seen.add(match[2]);
      return [{code:match[2],name:match[1].trim(),year:Number(c[2])||0,semester:parseInt(c[3],10)||0,period:c[3]||'',grade:c[4]||'',origin:c[5]||'',status:status(c[4],c[5]),entrance:/^TI67[123]$/.test(match[2]) || /^modulo o/.test(norm(match[1]))}];
    });
  }
  function average(courses){
    const graded=courses.filter(c=>!c.entrance&&c.status==='passed').flatMap(c=>{
      const match=String(c.grade||'').trim().match(/^(\d{1,2}(?:[.,]\d+)?)(?=\s|\(|$)/);
      if(!match)return [];
      const value=Number(match[1].replace(',','.'));
      return value>=0&&value<=10?[{...c,value}]:[];
    });
    return {value:graded.length?graded.reduce((sum,c)=>sum+c.value,0)/graded.length:null,count:graded.length,graded};
  }
  root.UnlaCore={norm,labels,status,parse,average};
  if(typeof module!=='undefined')module.exports=root.UnlaCore;
})(typeof window!=='undefined'?window:globalThis);
