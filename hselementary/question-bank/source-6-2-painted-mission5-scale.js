(function(root,factory){
  "use strict";
  if(typeof module==="object" && module.exports)module.exports=factory();
  else root.HSE_SOURCE_GRADE6_PAINTED_MISSION5_SCALE=factory();
})(typeof window!=="undefined" ? window : globalThis,function(){
  "use strict";
  function solve(facts){
    if(!facts || typeof facts!=="object")throw new TypeError("Missing Mission5 facts");
    const {cubeCount,exactlyTwoPaintedCubes,externalFaceCount,floorFaceCount,areaOfExactlyTwoPaintedFaces}=facts;
    const values=[cubeCount,exactlyTwoPaintedCubes,externalFaceCount,floorFaceCount,areaOfExactlyTwoPaintedFaces];
    if(!values.every(n=>Number.isSafeInteger(n)&&n>0) || exactlyTwoPaintedCubes>cubeCount || floorFaceCount>cubeCount || externalFaceCount>cubeCount*6 || externalFaceCount<=floorFaceCount)throw new RangeError("Invalid Mission5 measured facts");
    const faceArea=areaOfExactlyTwoPaintedFaces/(2*exactlyTwoPaintedCubes),edge=Math.sqrt(faceArea);
    if(!Number.isSafeInteger(faceArea)||!Number.isSafeInteger(edge))throw new RangeError("Only elementary integer-edge fixed variants are supported");
    const volume=cubeCount*edge*edge*edge,surfaceArea=externalFaceCount*faceArea,floorArea=floorFaceCount*faceArea,paintedArea=(externalFaceCount-floorFaceCount)*faceArea;
    if(![volume,surfaceArea,floorArea,paintedArea].every(Number.isSafeInteger))throw new RangeError("Mission5 result exceeds exact integer arithmetic");
    return Object.freeze({faceArea,edge,volume,surfaceArea,floorArea,paintedArea,sourceFidelityVerified:false,learnerReleaseVerified:false});
  }
  return Object.freeze({solve,registrationOnly:true,learnerReleaseVerified:false});
});
