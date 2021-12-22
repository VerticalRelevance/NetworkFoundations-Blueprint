import * as cdk from "@aws-cdk/core";
import * as iam from "@aws-cdk/aws-iam";
import * as servicecatalog from "@aws-cdk/aws-servicecatalog";
import { ServerOptions } from "https";

interface ProductProps extends cdk.StackProps {
  products: [
    servicecatalog.CloudFormationProduct,
    servicecatalog.CloudFormationProduct
  ];
}

export class NetworkFoundationsPortfolioStack extends cdk.Stack {
  readonly networkFoundationsPortfolio: servicecatalog.Portfolio;

  constructor(scope: cdk.Construct, id: string, props: ProductProps) {
    super(scope, id, props);

    const networkPortfolio = new servicecatalog.Portfolio(
      this,
      "NetworkPortfolio",
      {
        displayName: "NetworkPortfolio",
        providerName: "Bhavik Shah",
      }
    );

    const role = iam.Role.fromRoleArn(
      this,
      "ExistingAdminRole",
      "arn:aws:iam::899456967600:role/aws-reserved/sso.amazonaws.com/AWSReservedSSO_AWSAdministratorAccess_30f517a3940f0385"
    );

    networkPortfolio.giveAccessToRole(role);

    props.products.forEach((element) => {
      networkPortfolio.addProduct(element);
    });

    this.networkFoundationsPortfolio = networkPortfolio;
  }
}
