import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

interface PeeringProps extends cdk.StackProps {
  vpcs: [ec2.Vpc, ec2.Vpc];
}

export class PeeringStack extends cdk.Stack {

  constructor(scope: cdk.Construct, id: string, props: PeeringProps) {
    super(scope, id, props);

    // Create the peering connection
    const peer = new ec2.CfnVPCPeeringConnection(this, 'Peer', {
      vpcId: props.vpcs[0].vpcId,
      peerVpcId: props.vpcs[1].vpcId
    });

    // Add route from the private subnet of the first VPC to the second VPC over the peering connection
    props.vpcs[0].privateSubnets.forEach(({ routeTable: { routeTableId } }, index) => {
      new ec2.CfnRoute(this, 'RouteFromPrivateSubnetOfVpc1ToVpc2' + index, {
        destinationCidrBlock: props.vpcs[1].vpcCidrBlock,
        routeTableId,
        vpcPeeringConnectionId: peer.ref,
      });
    });

    // Add route from the private subnet of the second VPC to the first VPC over the peering connection
    props.vpcs[1].privateSubnets.forEach(({ routeTable: { routeTableId } }, index) => {
      new ec2.CfnRoute(this, 'RouteFromPrivateSubnetOfVpc2ToVpc1' + index, {
        destinationCidrBlock: props.vpcs[0].vpcCidrBlock,
        routeTableId,
        vpcPeeringConnectionId: peer.ref,
      });
    });
  }
}