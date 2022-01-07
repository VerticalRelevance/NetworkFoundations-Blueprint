import * as ec2 from "@aws-cdk/aws-ec2";
import * as cdk from "@aws-cdk/core";

export class BuildingBlocksStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpcCidr = this.node.tryGetContext("vpcCidr");
    const publicCidrMask = this.node.tryGetContext("publicCidrMask");
    const privateCidrMask = this.node.tryGetContext("privateCidrMask");
    const isolatedCidrMask = this.node.tryGetContext("isolatedCidrMask");
    const natGateways = this.node.tryGetContext("natGateways");
    const maxAzs = this.node.tryGetContext("maxAzs");
    const appName = this.node.tryGetContext("appName");

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
          subnetType: ec2.SubnetType.PRIVATE,
          cidrMask: privateCidrMask,
        },
        {
          name: appName.concat("isolated-subnet"),
          subnetType: ec2.SubnetType.ISOLATED,
          cidrMask: isolatedCidrMask,
        },
      ],
    });

    const privateHostedZone = new route53.PrivateHostedZone(
      this,
      "HostedZone",
      {
        zoneName: "private.domain.com",
        vpc, // At least one VPC has to be added to a Private Hosted Zone.
      }
    );
  }
}
