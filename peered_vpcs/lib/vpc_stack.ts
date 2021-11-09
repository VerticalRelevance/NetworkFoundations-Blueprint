import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

interface VpcProps extends cdk.StackProps {
  appName: string,
  vpcSetup: {
    cidr: string, // <--- each VPC will need a CIDR
    maxAzs: number, // <--- optionally the number of Availability Zones can be provided; defaults to 2 in our particular case
    natGateways: number,
    publicCidrMask: number,
    privateCidrMask: number,
    isolatedCidrMask: number,
  };
}



export class VpcStack extends cdk.Stack {

  readonly createdVpc: ec2.Vpc

  constructor(scope: cdk.Construct, id: string, props: VpcProps) {
    super(scope, id, props);

    // const vpcCidr = this.node.tryGetContext("vpcCidr");
    // const publicCidrMask = this.node.tryGetContext("publicCidrMask");
    // const privateCidrMask = this.node.tryGetContext("privateCidrMask");
    // const isolatedCidrMask = this.node.tryGetContext("isolatedCidrMask");
    // const natGateways = this.node.tryGetContext("natGateways");
    // const maxAzs = this.node.tryGetContext("maxAzs");
    // const appName = this.node.tryGetContext("appName");

    const vpc = new ec2.Vpc(
      this, 
      props.appName.concat("-vpc"), 
      {
        cidr: props.vpcSetup.cidr,
        natGateways: props.vpcSetup.natGateways,
        maxAzs: props.vpcSetup.maxAzs,
        subnetConfiguration: [
          {
            name: props.appName.concat('public-subnet'),
            subnetType: ec2.SubnetType.PUBLIC,
            cidrMask: props.vpcSetup.publicCidrMask,
          },
          {
            name: props.appName.concat('private-subnet'),
            subnetType: ec2.SubnetType.PRIVATE,
            cidrMask: props.vpcSetup.privateCidrMask,
          },
          {
            name: props.appName.concat('isolated-subnet'),
            subnetType: ec2.SubnetType.ISOLATED,
            cidrMask: props.vpcSetup.isolatedCidrMask,
          },
        ],
      }
    );

    this.createdVpc = vpc;
  }
}
