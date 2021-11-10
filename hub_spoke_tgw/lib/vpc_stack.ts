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
  readonly privateSubnets: ec2.ISubnet[]

  constructor(scope: cdk.Construct, id: string, props: VpcProps) {
    super(scope, id, props);

    const vpcCidr = props.vpcSetup.cidr;
    const publicCidrMask = props.vpcSetup.publicCidrMask
    const privateCidrMask = props.vpcSetup.privateCidrMask
    const isolatedCidrMask = props.vpcSetup.isolatedCidrMask
    const natGateways = props.vpcSetup.natGateways
    const maxAzs = props.vpcSetup.maxAzs
    const appName = props.appName

    const vpc = new ec2.Vpc(
      this, 
      appName.concat("-vpc"), 
      {
        cidr: vpcCidr,
        natGateways: natGateways,
        maxAzs: maxAzs,
        subnetConfiguration: [
          {
            name: appName.concat('public-subnet'),
            subnetType: ec2.SubnetType.PUBLIC,
            cidrMask: publicCidrMask,
          },
          {
            name: appName.concat('private-subnet'),
            subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            cidrMask: privateCidrMask,
          },
          {
            name: appName.concat('isolated-subnet'),
            subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
            cidrMask: isolatedCidrMask,
          },
        ],
      }
    );

    this.createdVpc = vpc;
    this.privateSubnets = vpc.privateSubnets
  }
}
