#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { BuildingBlocksStack } from "../lib/building_blocks-stack";

const app = new cdk.App();
new BuildingBlocksStack(app, "BuildingBlocksStack", {
  /* If you don't specify 'env', this stack will be environment-agnostic.
   * Account/Region-dependent features and context lookups will not work,
   * but a single synthesized template can be deployed anywhere. */
  /* Uncomment the next line to specialize this stack for the AWS Account
   * and Region that are implied by the current CLI configuration. */
  // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  /* Uncomment the next line if you know exactly what Account and Region you
   * want to deploy the stack to. */
  // env: { account: '123456789012', region: 'us-east-1' },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});

const appName = app.node.tryGetContext("appName");
const owner = app.node.tryGetContext("owner");
const environment = app.node.tryGetContext("environment");

// Tags
cdk.Tags.of(app).add("application", appName);
cdk.Tags.of(app).add("owner", owner);
cdk.Tags.of(app).add("environment", environment);
