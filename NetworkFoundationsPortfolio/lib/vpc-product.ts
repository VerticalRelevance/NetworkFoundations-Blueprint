import * as ec2 from "@aws-cdk/aws-ec2";
import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as route53 from "@aws-cdk/aws-route53";

import * as servicecatalog from "@aws-cdk/aws-servicecatalog";

export class VpcStack extends cdk.Stack {
  readonly vpcProduct: servicecatalog.CloudFormationProduct;

  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id);

    const appName = "threeTierVPCProduct";
    class ThreeTierVPCProduct extends servicecatalog.ProductStack {
      constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        const natGateways = new cdk.CfnParameter(this, "natGateways", {
          type: "Number",
          description: "The number of Nat Gateways to attach. Minimum is 1.",
        });

        const maxAzs = new cdk.CfnParameter(this, "maxAzs", {
          type: "Number",
          description: "The number of AZs to create subnets in. Minimum is 2.",
        });

        const publicCidrMask = new cdk.CfnParameter(this, "publicCidrMask", {
          type: "Number",
          description: "The CIDR mask of public subnets. E.g. 24",
        });

        const privateCidrMask = new cdk.CfnParameter(this, "privateCidrMask", {
          type: "Number",
          description: "The CIDR mask of private subnets. E.g. 24",
        });

        const isolatedCidrMask = new cdk.CfnParameter(
          this,
          "isolatedCidrMask",
          {
            type: "Number",
            description: "The CIDR mask of isolated subnets. E.g. 28",
          }
        );

        const vpc = new ec2.Vpc(this, "threeTierVPC", {
          cidr: "10.0.0.0/16", // TODO: Fix this later and do not hard code.
        });

        const publicSubnets = new ec2.Subnet(this, "publicSubnet", {
          availabilityZone: "us-west-1a",
          cidrBlock: "10.1.0.0/24",
          vpcId: vpc.vpcId,
        });
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

    this.vpcProduct = threeTierVPC;
  }
}
