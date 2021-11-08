import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';

export class BuildingBlocksStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpcCidr = this.node.tryGetContext("vpcCidr");
    const publicCidrMask = this.node.tryGetContext("publicCidrMask");
    const privateCidrMask = this.node.tryGetContext("privateCidrMask");
    const isolatedCidrMask = this.node.tryGetContext("isolatedCidrMask");
    const natGateways = this.node.tryGetContext("natGateways");
    const maxAzs = this.node.tryGetContext("maxAzs")

    const vpc = new ec2.Vpc(this, 'my-cdk-vpc', {
      cidr: vpcCidr,
      natGateways: natGateways,
      maxAzs: maxAzs,
      subnetConfiguration: [
        {
          name: 'public-subnet-1',
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: publicCidrMask,
        },
        {
          name: 'private-subnet-1',
          subnetType: ec2.SubnetType.PRIVATE,
          cidrMask: privateCidrMask,
        },
        {
          name: 'isolated-subnet-1',
          subnetType: ec2.SubnetType.ISOLATED,
          cidrMask: isolatedCidrMask,
        },
      ],
    });
  }
}
