import * as ec2 from "@aws-cdk/aws-ec2";
import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as route53 from "@aws-cdk/aws-route53";

import * as servicecatalog from "@aws-cdk/aws-servicecatalog";

export class BuildingBlocksStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id);

    // const vpcCidr = this.node.tryGetContext("vpcCidr");

    const appName = this.node.tryGetContext("appName");

    class ThreeTierVPCProduct extends servicecatalog.ProductStack {
      constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        // TODO: Implement this.
        // const vpcCidr = new cdk.CfnParameter(this, "vpcCidr", {
        //   type: "String",
        //   description: "The CIDR of the VPC",
        //   default: "10.0.0.0/16",
        // });

        const natGateways = new cdk.CfnParameter(this, "natGateways", {
          type: "Number",
          description: "The number of Nat Gateways to attach",
          default: 1,
        });

        const maxAzs = new cdk.CfnParameter(this, "maxAzs", {
          type: "Number",
          description: "The number of AZs to create subnets in",
          default: "3",
        });

        const publicCidrMask = new cdk.CfnParameter(this, "publicCidrMask", {
          type: "Number",
          description: "The CIDR mask of public subnets",
          default: "24",
        });

        const privateCidrMask = new cdk.CfnParameter(this, "privateCidrMask", {
          type: "Number",
          description: "The CIDR mask of private subnets",
          default: "24",
        });

        const isolatedCidrMask = new cdk.CfnParameter(
          this,
          "isolatedCidrMask",
          {
            type: "Number",
            description: "The CIDR mask of isolated subnets",
            default: "28",
          }
        );

        const vpc = new ec2.Vpc(this, appName.concat("-vpc"), {
          cidr: "10.0.0.0/16", // Fix this later.
          natGateways: natGateways.valueAsNumber,
          maxAzs: maxAzs.valueAsNumber,
          subnetConfiguration: [
            {
              name: appName.concat("public-subnet"),
              subnetType: ec2.SubnetType.PUBLIC,
              cidrMask: publicCidrMask.valueAsNumber,
            },
            {
              name: appName.concat("private-subnet"),
              subnetType: ec2.SubnetType.PRIVATE,
              cidrMask: privateCidrMask.valueAsNumber,
            },
            {
              name: appName.concat("isolated-subnet"),
              subnetType: ec2.SubnetType.ISOLATED,
              cidrMask: isolatedCidrMask.valueAsNumber,
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

    const threeTierVPC = new servicecatalog.CloudFormationProduct(
      this,
      "ThreeTierVPC",
      {
        productName: "ThreeTierVPC",
        owner: "Bhavik Shah",
        productVersions: [
          {
            productVersionName: "v0.1",
            cloudFormationTemplate:
              servicecatalog.CloudFormationTemplate.fromProductStack(
                new ThreeTierVPCProduct(this, "ThreeTierVPCProduct")
              ),
          },
        ],
      }
    );

    const networkPortfolio = new servicecatalog.Portfolio(
      this,
      "NetworkPortfolio",
      {
        displayName: "NetworkPortfolio",
        providerName: "Bhavik Shah",
      }
    );

    networkPortfolio.addProduct(threeTierVPC);

    const role = iam.Role.fromRoleArn(
      this,
      "ExistingAdminRole",
      "arn:aws:iam::899456967600:role/aws-reserved/sso.amazonaws.com/AWSReservedSSO_AWSAdministratorAccess_30f517a3940f0385"
    );

    networkPortfolio.giveAccessToRole(role);
  }
}
