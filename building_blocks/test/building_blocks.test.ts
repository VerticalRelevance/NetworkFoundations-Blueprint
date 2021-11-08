import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as BuildingBlocks from '../lib/building_blocks-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new BuildingBlocks.BuildingBlocksStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
