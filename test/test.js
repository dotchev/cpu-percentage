'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

var cpuPercentage = require('..');

describe('cpuPercentage', () => {
	var sandbox;
	beforeEach(() => {
		sandbox = sinon.sandbox.create();
		sandbox.stub(process, 'cpuUsage');
		sandbox.stub(process, 'uptime');
		sandbox.stub(Date, 'now');
	});
	afterEach(() => {
		sandbox.restore();
	});

	it('should return usage since process start, if called without arguments', () => {
		process.cpuUsage.returns({ system: 10000, user: 20000 });
		process.uptime.returns(1);
		expect(cpuPercentage()).eql({
			system: 10000,
			user: 20000,
			time: 1000,
			percent: 3
		});
	});

	it('should return usage since a previous result', () => {
		process.cpuUsage.returns({ system: 10000, user: 20000 });
		process.uptime.returns(1);
		Date.now.returns(55000);
		var start = cpuPercentage();

		process.cpuUsage.returns({ system: 12000, user: 28000 });
		Date.now.returns(55050);
		expect(cpuPercentage(start)).eql({
			system: 12000,
			user: 28000,
			time: 50,
			percent: 80
		});
	});


	it('result should have nonenumerable proerty _start', () => {
		process.cpuUsage.returns({ system: 10000, user: 20000 });
		process.uptime.returns(1);
		expect(cpuPercentage()).to.have.property('_start');
		expect(cpuPercentage()).to.not.have.keys('_start');
	});
	
});