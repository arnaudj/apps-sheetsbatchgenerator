function helpersTest() {
  module("Helpers tests");
  
  test("test variables replacement", function(assert) {

    // test: variable has its own cell
    var outputDoc = {"${var1}":"val1", "${var2}":"val2"};
    var values = [
      ["text1A", "${var1}", "text1B"],
      ["text2A", "${var2}", "text2B"],
      ];
      
    var hits = applyTemplating(values, outputDoc);
      
    var expected = [
      ["text1A", "val1", "text1B"],
      ["text2A", "val2", "text2B"],
      ];
    equal(hits, 2, "ok nb of replacements" );
    deepEqual(values, expected); 
  });  
  
  //
  module("Misc");
  test("asserts toolbox test", function(assert) {
    assert.ok(true, "always fine");
    
    var c = 1;
    equal(c, 1, "test equal" );
    
    // test unordered deep equality
    var object1 = {"k2":"v2", "k1": "v1"};
    deepEqual(object1, {"k1": "v1", "k2":"v2"});    
  }); 
}

