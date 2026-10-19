import {gradeSum} from './core.js?v=number-paper-1';
import {restoreHelp} from './calculation-help.js?v=6';
export const difficultyFor=value=>value==='challenge'?'challenge':'play';
export const initialCalculation=()=>({input:'',solved:false});
export function restoreCalculation(p,model,value) {
  const input=typeof value?.input==='string'?value.input.slice(0,4):'';
  return {input,solved:model.phase==='done'&&value?.solved===true&&gradeSum(p,input),...restoreHelp(p,model,value)};
}
export const completedActivity=(difficulty,model,calculation)=>model.phase==='done'&&(difficulty!=='challenge'||calculation.solved);
export const phaseFor=(difficulty,model,calculation)=>model.phase==='done'&&!completedActivity(difficulty,model,calculation)?'calculate':model.phase;
export function submitCalculation(p,model,calculation) {
  if(model.phase!=='done'||calculation.solved)return calculation;
  return {...calculation,solved:gradeSum(p,calculation.input)};
}
