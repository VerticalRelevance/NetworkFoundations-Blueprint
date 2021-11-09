import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as PeeredVpcs from '../lib/peered_vpcs-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new PeeredVpcs.PeeredVpcsStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
