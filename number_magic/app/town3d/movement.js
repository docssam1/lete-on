/* All movement sources use this clock-based, bounded contract. Screen east is
   world +x; screen down is world +z for the fixed south-facing town camera. */
export const MOVEMENT = Object.freeze({deadzone:.16, exponent:1.35, maxSpeed:4.2, maxFrameSeconds:.05, sweep:.12});
export function joystickVector(dx,dy,radius=42){
 const d=Math.hypot(dx,dy),u=Math.min(1,d/radius);
 if(!d||u<=MOVEMENT.deadzone)return {x:0,z:0};
 const speed=Math.pow((u-MOVEMENT.deadzone)/(1-MOVEMENT.deadzone),MOVEMENT.exponent);
 return {x:dx/d*speed,z:dy/d*speed};
}
export function moveSafely(position,vector,dt,canMove){
 const mag=Math.hypot(vector.x,vector.z),n=Math.max(1,mag),distance=MOVEMENT.maxSpeed*Math.min(Math.max(0,dt),MOVEMENT.maxFrameSeconds);
 const dx=vector.x/n*distance,dz=vector.z/n*distance,steps=Math.max(1,Math.ceil(Math.hypot(dx,dz)/MOVEMENT.sweep));
 let {x,z}=position;
 for(let i=0;i<steps;i++){
  const nx=x+dx/steps,nz=z+dz/steps;
  if(canMove(nx,nz,x,z)){x=nx;z=nz;}
  else if(canMove(nx,z,x,z))x=nx;
  else if(canMove(x,nz,x,z))z=nz;
 }
 return {x,z};
}
