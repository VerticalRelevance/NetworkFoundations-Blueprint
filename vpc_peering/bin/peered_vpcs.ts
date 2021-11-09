#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { VpcStack } from '../lib/vpc_stack';
import { PeeringStack } from '../lib/peering_connection_stack';

const app = new cdk.App();
const first_vpc = new VpcStack(app, 'vpc1Stack', {
  appName: "vpc1",
  vpcSetup: {
    cidr: "10.0.0.0/16",
    maxAzs: 1,
    natGateways: 1,
    publicCidrMask: 24,
    privateCidrMask: 24,
    isolatedCidrMask: 27,
  },
});

const second_vpc = new VpcStack(app, 'vpc2Stack', {
  appName: "vpc2",
  vpcSetup: {
    cidr: "10.1.0.0/16",
    maxAzs: 1,
    natGateways: 1,
    publicCidrMask: 24,
    privateCidrMask: 24,
    isolatedCidrMask: 27,
  },
});

new PeeringStack(app, 'PeeringStack', {
  vpcs: [first_vpc.createdVpc, second_vpc.createdVpc],
});