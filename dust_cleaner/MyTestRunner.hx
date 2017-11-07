class MyTest extends haxe.unit.TestCase{
    public function testPrepData() {
        // assertEquals("A", "A");
        var client = new DustCleanerClient();
        var actual = client.prep_data(20, 20);
        var expected = {"PM10": 0.02, "PM2_5": 0.02, "PM10_diff": 0.02, "PM2_5_diff": 0.02};
        assertEquals(Std.string(expected), Std.string(actual));


        //! make proper test for testing diff ie value should be different to 
        // pm10 etc
        expected = {"PM10": 0.01, "PM2_5": 0.01, "PM10_diff": -0.01, "PM2_5_diff": -0.01};
        actual = client.prep_data(10, 10);
        assertEquals(Std.string(expected), Std.string(actual));
    }
}

class MyTestRunner {
    static function main() { 
        var r = new haxe.unit.TestRunner();
        r.add(new MyTest());
        // add other TestCases here

        // finally, run the tests
        r.run();
        
    }
}
