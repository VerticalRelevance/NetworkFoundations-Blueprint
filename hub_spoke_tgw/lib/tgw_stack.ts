import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';


export class TGWStack extends cdk.Stack {

  readonly createdTGW: ec2.CfnTransitGateway;

  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    // Create the peering connection
    const transit_gateway = new ec2.CfnTransitGateway(
      this,
      "tgw", {
      amazonSideAsn: 64512,
      defaultRouteTableAssociation: 'enable',
      defaultRouteTablePropagation: 'enable',
    });

    this.createdTGW = transit_gateway;
  }
}