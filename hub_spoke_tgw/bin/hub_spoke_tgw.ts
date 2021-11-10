#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { VpcStack } from '../lib/vpc_stack';
import { TGWStack } from '../lib/tgw_stack';
import { TGWAttachmentStack } from '../lib/tgw_attachment_stack';

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

const third_vpc = new VpcStack(app, 'vpc3Stack', {
  appName: "vpc2",
  vpcSetup: {
    cidr: "10.3.0.0/16",
    maxAzs: 1,
    natGateways: 1,
    publicCidrMask: 24,
    privateCidrMask: 24,
    isolatedCidrMask: 27,
  },
});

const tgs = new TGWStack(app, "tgw", {})

const attachments = new TGWAttachmentStack(app, "tgwAttachments", {
  vpcs: [first_vpc.createdVpc, second_vpc.createdVpc, third_vpc.createdVpc],
  subnets: [first_vpc.privateSubnets, second_vpc.privateSubnets, third_vpc.privateSubnets],
  transitGateway: tgs.createdTGW
});