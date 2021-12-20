#!/usr/bin/env node

import * as ec2 from "@aws-cdk/aws-ec2";
import * as cdk from "@aws-cdk/core";
import * as ssm from "@aws-cdk/aws-ssm";

import * as servicecatalog from "@aws-cdk/aws-servicecatalog";
import { validateString } from "@aws-cdk/core";

export class VpcPeeringStack extends cdk.Stack {
  readonly vpcPeeringProduct: servicecatalog.CloudFormationProduct;

  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id);

    const appName = "threeTierVPCProduct";
    //TODO: Get appName properly
    //const appName = this.node.tryGetContext("appName");

    class VPCPeeringProduct extends servicecatalog.ProductStack {
      constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        // TODO: Implement this.
        // const vpc1ID = new cdk.CfnParameter(this, "vpc1ID", {
        //   type: "String",
        //   description: "The ID of VPC 1",
        //   default: "vpc-0359539d50d0f7b2c",
        // });
        // const vpc2ID = new cdk.CfnParameter(this, "vpc2ID", {
        //   type: "String",
        //   description: "The ID of VPC 2",
        //   default: "vpc-02376e85e5bebae76",
        // });

        //TODO: Remove the Hard coded SSM parameters.

        const vpc1Id = ssm.StringParameter.valueFromLookup(
          this,
          "/network_foundations/VPC1ID"
        );

        const vpc2Id = ssm.StringParameter.valueFromLookup(
          this,
          "/network_foundations/VPC2ID"
        );

        const vpc1 = ec2.Vpc.fromLookup(this, "VPC1", {
          vpcId: vpc1Id,
        });

        const vpc2 = ec2.Vpc.fromLookup(this, "VPC2", {
          vpcId: vpc2Id,
        });

        // // Get the first VPCs
        // const vpc1 = ec2.Vpc.fromLookup(this, "vpc1", {
        //   isDefault: false,
        //   vpcId: vpc1ID.valueAsString, //TODO: Provide Value from Service Catalog
        //   //vpcId: "vpc-0359539d50d0f7b2c",
        // });

        // // Get the second VPC
        // const vpc2 = ec2.Vpc.fromLookup(this, "vpc2", {
        //   isDefault: false,
        //   //vpcId: "vpc-02376e85e5bebae76",
        //   vpcId: vpc2ID.valueAsString, //TODO: Provide Value from Service Catalog
        // });

        // Create the peering connection
        const peer = new ec2.CfnVPCPeeringConnection(this, "Peer", {
          vpcId: vpc1.vpcId,
          peerVpcId: vpc2.vpcId,
        });

        // Add route from the private subnet of the first VPC to the second VPC over the peering connection
        vpc1.privateSubnets.forEach(
          ({ routeTable: { routeTableId } }, index) => {
            new ec2.CfnRoute(
              this,
              "RouteFromPrivateSubnetOfVpc1ToVpc2" + index,
              {
                destinationCidrBlock: vpc2.vpcCidrBlock,
                routeTableId,
                vpcPeeringConnectionId: peer.ref,
              }
            );
          }
        );

        // Add route from the private subnet of the second VPC to the first VPC over the peering connection
        vpc2.privateSubnets.forEach(
          ({ routeTable: { routeTableId } }, index) => {
            new ec2.CfnRoute(
              this,
              "RouteFromPrivateSubnetOfVpc2ToVpc1" + index,
              {
                destinationCidrBlock: vpc1.vpcCidrBlock,
                routeTableId,
                vpcPeeringConnectionId: peer.ref,
              }
            );
          }
        );

        //Add Product code above this
      }
    }
    const vpcPeeringProduct = new servicecatalog.CloudFormationProduct(
      this,
      "vpcPeeringProduct",
      {
        productName: "VPCPeering",
        owner: "Bhavik Shah",
        productVersions: [
          {
            productVersionName: "v0.1",
            cloudFormationTemplate:
              servicecatalog.CloudFormationTemplate.fromProductStack(
                new VPCPeeringProduct(this, "vpcPeeringProduct")
              ),
          },
        ],
      }
    );

    this.vpcPeeringProduct = vpcPeeringProduct;
  }
}
