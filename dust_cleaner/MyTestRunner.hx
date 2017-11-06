class MyTest extends haxe.unit.TestCase{
    public function testBasic() {
        assertEquals("A", "A");
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
