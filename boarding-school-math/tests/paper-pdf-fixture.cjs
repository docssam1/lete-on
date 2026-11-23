function fixturePdf(count) {
  const objects = ["<< /Type /Catalog /Pages 2 0 R >>", `<< /Type /Pages /Count ${count} /Kids [${Array.from({length:count},(_,n)=>`${4+n*2} 0 R`).join(" ")}] >>`, "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"];
  for (let n=0;n<count;n++) {
    const text=`BT /F1 18 Tf 40 740 Td (${n+1}.) Tj 0 -35 Td (Reader QA page ${n+1}) Tj 0 -35 Td (Choose an answer without revealing the solution.) Tj ET`;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${5+n*2} 0 R >>`, `<< /Length ${Buffer.byteLength(text)} >>\nstream\n${text}\nendstream`);
  }
  let value="%PDF-1.4\n",offsets=[0];objects.forEach((object,i)=>{offsets.push(Buffer.byteLength(value));value+=`${i+1} 0 obj\n${object}\nendobj\n`;});
  const xref=Buffer.byteLength(value);value+=`xref\n0 ${objects.length+1}\n0000000000 65535 f \n`+offsets.slice(1).map(n=>String(n).padStart(10,"0")+" 00000 n \n").join("")+`trailer\n<< /Size ${objects.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return Buffer.from(value);
}

module.exports = fixturePdf;
