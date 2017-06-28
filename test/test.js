var should = require('should'),
	abbrev = require('../abbreviate-number').abbreviate,
	commatize = require('../abbreviate-number').commatize;

describe('analytics-rounding', function(){
    describe('#abbreviate', function() {
        it('should reject non numbers', function(done) {
        	abbrev("").should.eql( "" );
        	abbrev(null).should.eql( "" );
        	abbrev("abcd").should.eql( "" );
        	done();
        });
        it('should accept strings containing a valid number', function(done) {
        	abbrev("0").should.eql( "0" );
        	abbrev("1234").should.eql( "1.2K" );
        	abbrev("-523").should.eql( "-523" );
        	done();
        });
        it('should leave number smaller than 1000 as is', function(done) {
        	abbrev(3).should.eql( "3" );
        	abbrev(79).should.eql( "79" );
        	abbrev(678).should.eql( "678" );
        	done();
        });
        it('should abbreviate thousands', function(done) {
        	abbrev(999).should.not.eql(  "1K" );
        	abbrev(1000).should.eql(     "1K" );
        	abbrev(1005).should.eql(     "1K" );
        	abbrev(1213).should.eql(   "1.2K" );
        	abbrev(1268).should.eql(   "1.3K" );
        	abbrev(8283).should.eql(   "8.3K" );
        	abbrev(9999).should.eql(    "10K" );
        	abbrev(23678).should.eql( "23.7K" );
			abbrev(759654).should.eql( "760K" );
			abbrev(1000000).should.not.eql( "1000K" );
        	done();
        });
        it('should abbreviate millions', function(done) {
        	abbrev(1234567).should.eql( "1.2M" );
        	abbrev(12345678).should.eql( "12.3M" );
        	abbrev(123456789).should.eql( "123M" );
        	done();
        });
        it('should abbreviate billions', function(done) {
        	abbrev(1234567891).should.eql( "1.2B" );
        	abbrev(12385678912).should.eql( "12.4B" );
        	done();
        });
        it('should abbreviate trillions', function(done) {
        	abbrev(1234567891234).should.eql( "1.2T" );
        	abbrev(1234567891234567).should.eql( "1,235T" );
        	done();
        });
        it('should support forced units', function(done) {
        	abbrev(1234567891234, { forceUnit: "" } ).should.eql( "1,234,567,891,234" );
        	abbrev(1234567891234, { forceUnit: "K" } ).should.eql( "1,234,567,891K" );
        	abbrev(1234567891234, { forceUnit: "M" } ).should.eql( "1,234,568M" );
        	abbrev(1234567891234, { forceUnit: "B" } ).should.eql( "1,235B" );
        	abbrev(1234567891234, { forceUnit: "T" } ).should.eql( "1.2T" );
        	abbrev(78, { forceUnit: "K" } ).should.eql( "0.1K" );
        	abbrev(78, { forceUnit: "K", maxFractionalDigits: 2 } ).should.eql( "0.08K" );
        	abbrev(78, { forceUnit: "K", maxFractionalDigits: 3 } ).should.eql( "0.078K" );
        	done();
        });
        it('should support a threshold below which no abbreviation is done', function(done) {
        	abbrev(1234567891234, { noAbbrevUnder: 1000000 } ).should.eql( "1.2T" );
        	abbrev(1234567891,    { noAbbrevUnder: 1000000 } ).should.eql( "1.2B" );
        	abbrev(1234567,       { noAbbrevUnder: 1000000 } ).should.eql( "1.2M" );
        	abbrev(123456,        { noAbbrevUnder: 1000000 } ).should.eql( "123,456" );
        	abbrev(1234,          { noAbbrevUnder: 1000000 } ).should.eql( "1,234" );
        	abbrev(12,            { noAbbrevUnder: 1000000 } ).should.eql( "12" );
        	done();
        });
        it('should support to turn off commas', function(done) {
        	abbrev(1234567891234, { forceUnit: "K", addCommas: false } ).should.eql( "1234567891K" );
        	done();
        });
        it('should support negative numbers', function(done) {
        	abbrev(-79).should.eql( "-79" );
        	abbrev(-1000).should.eql( "-1K" );
        	abbrev(-123456789).should.eql( "-123M" );
        	abbrev(-1234567891234, { forceUnit: "K" } ).should.eql( "-1,234,567,891K" );
        	abbrev(-78, { forceUnit: "K" } ).should.eql( "-0.1K" );
        	done();
        });
        it('should abbreviate with no fractional part', function(done) {
        	abbrev(1234567891,  { maxFractionalDigits: 0 } ).should.eql( "1B" );
        	abbrev(12885678912, { maxFractionalDigits: 0 } ).should.eql( "13B" );
        	done();
        });
        it('should let you control max fractional part', function(done) {
        	abbrev(1234567891,  { maxFractionalDigits: 2 } ).should.eql( "1.23B" );
        	abbrev(12885678912, { maxFractionalDigits: 2 } ).should.eql( "12.9B" );
        	abbrev(12885678912, { maxFractionalDigits: 2, meaningfulDigits: 4 } ).should.eql( "12.89B" );
        	abbrev(12885678912, { maxFractionalDigits: 2, meaningfulDigits: 1 } ).should.eql( "13B" );
        	abbrev(1,           { maxFractionalDigits: 2 } ).should.eql( "1" );
        	abbrev(0.1,         { maxFractionalDigits: 2 } ).should.eql( "0.1" );
        	abbrev(0.03,        { maxFractionalDigits: 2 } ).should.eql( "0.03" );
        	abbrev(0.0045,      { maxFractionalDigits: 2 } ).should.eql( "<0.01" );
        	abbrev(0.0099,      { maxFractionalDigits: 2 } ).should.eql( "0.01" );
        	done();
        });
        it('should let you control nmber of meaningful digits', function(done) {
    	 	abbrev(0.1234,      { maxFractionalDigits: 2, meaningfulDigits: 1 } ).should.eql( "0.1" );
    	 	abbrev(0.1234,      { maxFractionalDigits: 2, meaningfulDigits: 2 } ).should.eql( "0.12" );
    	 	abbrev(0.1234,      { maxFractionalDigits: 2, meaningfulDigits: 3 } ).should.eql( "0.12" );
    	 	abbrev(0.1234,      { maxFractionalDigits: 3, meaningfulDigits: 3 } ).should.eql( "0.123" );
    	 	abbrev(7.1234,      { maxFractionalDigits: 3, meaningfulDigits: 3 } ).should.eql( "7.12" );
    	 	abbrev(71.234,      { maxFractionalDigits: 3, meaningfulDigits: 3 } ).should.eql( "71.2" );
    	 	abbrev(712.34,      { maxFractionalDigits: 3, meaningfulDigits: 3 } ).should.eql( "712" );
        	done();
        });
        it('should render very small numbers as <0.xxx', function(done) {
            abbrev(0.001).should.eql( "<0.1" );
            abbrev(0.001, { lowNumbersAsSmallerThan: false }).should.eql( "0" );
            abbrev(0.001, { maxFractionalDigits: 2 }).should.eql( "<0.01" );
            abbrev(0.001, { maxFractionalDigits: 2, lowNumbersAsSmallerThan: false }).should.eql( "0" );
            abbrev(0.0999).should.eql( "0.1", "0.09999 rounds to 0.1" );
            abbrev(0.05).should.eql( "0.1", "0.05 rounds to 0.1 (nearest)" );
            abbrev(0.0499).should.eql( "<0.1", "0.04999 rounds to 0.0 (nearest)" );
            abbrev(12, {forceUnit:"K"}).should.eql( "<0.1K" );
            done();
        });
    });

    describe('#commatize', function() {
        it('should leave intact small numbers', function(done) {
        	commatize(1).should.eql("1");
        	commatize(0.56).should.eql("0.56");
        	commatize(967.3).should.eql("967.3");
        	commatize(1000).should.not.eql("1000");
        	done();
        });
        it('should add commas to numbers larger than 1000', function(done) {
        	commatize(1).should.eql("1");
        	commatize(0.56).should.eql("0.56");
        	commatize(967.3).should.eql("967.3");
        	commatize(1000).should.eql("1,000");
        	commatize(6758.635).should.eql("6,758.635");
        	commatize(64352628292).should.eql("64,352,628,292");
        	commatize(4562738.5).should.eql("4,562,738.5");
        	done();
        });
    });
});













