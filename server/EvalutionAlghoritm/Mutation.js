import GetRndInteger from "./GetRndInteger";

export default function Mutation(individ, p_genes) {
  individ.forEach((gene) => {
    if (Math.random() < p_genes) {
      let day = GetRndInteger();
    }
  });
  return individ;
}
