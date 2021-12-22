#!/usr/bin/env node

import * as ec2 from "@aws-cdk/aws-ec2";
import * as cdk from "@aws-cdk/core";
import * as ssm from "@aws-cdk/aws-ssm";

import * as servicecatalog from "@aws-cdk/aws-servicecatalog";
import { validateString } from "@aws-cdk/core";

export class VpcPeeringStack extends cdk.Stack {
  readonly vpcPeeringSCProduct: servicecatalog.CloudFormationProduct;

  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id);

    const appName = "threeTierVPCProduct";
    //TODO: Get appName properly
    //const appName = this.node.tryGetContext("appName");

    class VPCPeeringProduct extends servicecatalog.ProductStack {
      constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        const vpc1ID = new cdk.CfnParameter(this, "vpc1ID", {
          type: "String",
          description: "The ID of VPC 1",
        });

        const vpc1CIDR = new cdk.CfnParameter(this, "vpc1CIDR", {
          type: "String",
          description: "CIDR block of the VPC1",
        });

        const vpc1AZs = new cdk.CfnParameter(this, "vpc1AZs", {
          type: "String",
          description: "Comma separated list of Availability zones in VPC1",
        });

        const vpc1PrivateSubnetIDs = new cdk.CfnParameter(
          this,
          "vpc1PrivateSubnets",
          {
            type: "String",
            description: "Comma separated list of Private Subnet IDs in VPC1",
          }
        );

        const vpc1PrivateSubnetRouteTableIDs = new cdk.CfnParameter(
          this,
          "vpc1PrivateSubnetRouteTableIDs",
          {
            type: "String",
            description:
              "Comma separated list of Private Subnet Route Table IDs in VPC1",
          }
        );

        const vpc2ID = new cdk.CfnParameter(this, "vpc2ID", {
          type: "String",
          description: "The ID of VPC 2",
        });

        const vpc2CIDR = new cdk.CfnParameter(this, "vpc2CIDR", {
          type: "String",
          description: "CIDR block of the VPC1",
        });

        const vpc2AZs = new cdk.CfnParameter(this, "vpc2AZs", {
          type: "String",
          description: "Comma separated list of Availability zones in VPC2",
        });

        const vpc2PrivateSubnetIDs = new cdk.CfnParameter(
          this,
          "vpc2PrivateSubnets",
          {
            type: "String",
            description: "Comma separated list of Private Subnet IDs in VPC2",
          }
        );

        const vpc2PrivateSubnetRouteTableIDs = new cdk.CfnParameter(
          this,
          "vpc2PrivateSubnetRouteTableIDs",
          {
            type: "String",
            description:
              "Comma separated list of Private Subnet Route Table IDs in VPC2",
          }
        );

        const vpc1AZsArray = vpc1AZs.valueAsString.split(",");
        const vpc2AZsArray = vpc2AZs.valueAsString.split(",");
        const vpc1PrivateSubnetIDsArray =
          vpc1PrivateSubnetIDs.valueAsString.split(",");
        const vpc2PrivateSubnetIDsArray =
          vpc2PrivateSubnetIDs.valueAsString.split(",");
        const vpc1PrivateSubnetRouteTableIDsArray =
          vpc1PrivateSubnetRouteTableIDs.valueAsString.split(",");
        const vpc2PrivateSubnetRouteTableIDsArray =
          vpc2PrivateSubnetRouteTableIDs.valueAsString.split(",");

        const vpc1 = ec2.Vpc.fromVpcAttributes(this, "VPC1", {
          vpcId: vpc1ID.valueAsString,
          vpcCidrBlock: vpc1CIDR.valueAsString,
          availabilityZones: vpc1AZsArray,
          privateSubnetIds: vpc1PrivateSubnetIDsArray,
          privateSubnetRouteTableIds: vpc1PrivateSubnetRouteTableIDsArray,
        });

        const vpc2 = ec2.Vpc.fromVpcAttributes(this, "VPC2", {
          vpcId: vpc2ID.valueAsString,
          vpcCidrBlock: vpc2CIDR.valueAsString,
          availabilityZones: vpc2AZsArray,
          privateSubnetIds: vpc2PrivateSubnetIDsArray,
          privateSubnetRouteTableIds: vpc2PrivateSubnetRouteTableIDsArray,
        });

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
    const vpcPeeringProductInstance = new servicecatalog.CloudFormationProduct(
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
                new VPCPeeringProduct(this, "vpcPeeringProductInstance")
              ),
          },
        ],
      }
    );

    this.vpcPeeringSCProduct = vpcPeeringProductInstance;
  }
}
