import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as route53 from "aws-cdk-lib/aws-route53";
import { Stack, StackProps } from "aws-cdk-lib";

import { Construct } from "constructs";

interface VpcProps extends StackProps {
  appName: string;
  vpcSetup: {
    cidr: string; // <--- each VPC will need a CIDR
    maxAzs: number; // <--- optionally the number of Availability Zones can be provided; defaults to 2 in our particular case
    natGateways: number;
    publicCidrMask: number;
    privateCidrMask: number;
    isolatedCidrMask: number;
    dnsPrivateHostedZoneName: string;
  };
}

export class VpcStack extends Stack {
  readonly createdVpc: ec2.Vpc;

  constructor(scope: Construct, id: string, props: VpcProps) {
    super(scope, id, props);
    const appName = props.appName;
    const vpcCidr = props.vpcSetup.cidr;
    const publicCidrMask = props.vpcSetup.publicCidrMask;
    const privateCidrMask = props.vpcSetup.privateCidrMask;
    const isolatedCidrMask = props.vpcSetup.isolatedCidrMask;
    const natGateways = props.vpcSetup.natGateways;
    const maxAzs = props.vpcSetup.maxAzs;
    const dnsPrivateHostedZoneName = props.vpcSetup.dnsPrivateHostedZoneName;

    const vpc = new ec2.Vpc(this, appName.concat("-vpc"), {
      cidr: vpcCidr,
      natGateways: natGateways,
      maxAzs: maxAzs,
      subnetConfiguration: [
        {
          name: appName.concat("public-subnet"),
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: publicCidrMask,
        },
        {
          name: props.appName.concat("private-subnet"),
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
          cidrMask: privateCidrMask,
        },
        {
          name: props.appName.concat("isolated-subnet"),
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: isolatedCidrMask,
        },
      ],
    });

    const privateHostedZone = new route53.PrivateHostedZone(
      this,
      "HostedZone",
      {
        zoneName: dnsPrivateHostedZoneName,
        vpc, // At least one VPC has to be added to a Private Hosted Zone.
      }
    );

    this.createdVpc = vpc;
  }
}
