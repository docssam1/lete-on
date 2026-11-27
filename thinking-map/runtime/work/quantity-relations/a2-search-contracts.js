(function () {
 const previous = GFieldA1.matchExamples;
 GFieldA1.matchExamples = function (data, text) {
  return previous(data, text).flatMap(row => (row.normalization.commonTypeIds || [row.typeId]).map(typeId => ({...row, typeId})));
 };
}());
