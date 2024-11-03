import { GraphQLScalarType, Kind } from "graphql";

export const MemberTypeIdScalar = new GraphQLScalarType({
  name: 'MemberTypeId',
  description: 'A string scalar for MemberTypeId',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    return null;
  },
});