#!/usr/bin/env node
'use strict';
// Preserve the established command, but verify the actually mounted implementation.
const path=require('path'),{spawnSync}=require('child_process');
for(const script of ['check-activity-journeys.js',...(process.argv.includes('--browser')?['check-journey-browser.js']:[])]){
 const result=spawnSync(process.execPath,[path.join(__dirname,script)],{stdio:'inherit',env:process.env,windowsHide:true});
 if(result.status!==0)process.exit(result.status||1);
}
