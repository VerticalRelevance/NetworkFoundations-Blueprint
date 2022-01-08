import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as route53 from "aws-cdk-lib/aws-route53";
import { Stack, StackProps } from "aws-cdk-lib";

import { Construct } from "constructs";

export class BuildingBlocksStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpcCidr = this.node.tryGetContext("vpcCidr");
    const publicCidrMask = this.node.tryGetContext("publicCidrMask");
    const privateCidrMask = this.node.tryGetContext("privateCidrMask");
    const isolatedCidrMask = this.node.tryGetContext("isolatedCidrMask");
    const natGateways = this.node.tryGetContext("natGateways");
    const maxAzs = this.node.tryGetContext("maxAzs");
    const appName = this.node.tryGetContext("appName");
    const dnsHostedZoneName = this.node.tryGetContext("dnsHostedZoneName");

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
          name: appName.concat("private-subnet"),
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
          cidrMask: privateCidrMask,
        },
        {
          name: appName.concat("isolated-subnet"),
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: isolatedCidrMask,
        },
      ],
    });

    const privateHostedZone = new route53.PrivateHostedZone(
      this,
      "HostedZone",
      {
        zoneName: dnsHostedZoneName,
        vpc, // At least one VPC has to be added to a Private Hosted Zone.
      }
    );
  }
}
