function helpersTest() {
  module("Helpers tests");

  var map = {"${var1}":"val1", "${var2}":"val2"};

  test("test variables replacement", function(assert) {

    // test: variable has its own cell
    var values = [
      ["text1A", "${var1}", "text1B"],
      ["text2A", "${var2}", "text2B"],
    ];
    var hits = applyTemplating(values, map);

    var expected = [
      ["text1A", "val1", "text1B"],
      ["text2A", "val2", "text2B"],
      ];
    equal(hits, 2, "ok nb of replacements");
    deepEqual(values, expected); 
  });  
  
  test("test variables inline replacement: cell", function(assert) {
    // x Cell level
    var out = applyTemplatingInline("${var2}", map).val;
    equal(out, "val2", "ok inline, alone in cell: " + out);

    var out = applyTemplatingInline("Before ${var1} and after.", map).val;
    equal(out, "Before val1 and after.", "ok inline, within text: " + out);

    var out = applyTemplatingInline("nothing to do", map).val;
    equal(out, "nothing to do", "ok inline, NTD.");
  });

  test("test variables inline replacement: matrix", function(assert) {
    // X Matrix level
    var values = [
      ["text1A", "Some ${var1}", "text1B"],
      ["text2A", "A ${var2} B", "text2B"],
    ];
    var hits = applyTemplating(values, map);
    var expected = [
      ["text1A", "Some val1", "text1B"],
      ["text2A", "A val2 B", "text2B"],
      ];
    equal(hits, 2, "ok nb of replacements");
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

