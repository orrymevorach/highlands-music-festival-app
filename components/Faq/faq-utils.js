const mapCategoryTypeToName = {
  arrivalDepartureCollection: 'Arrivals & Departures',
  accommodationsPackingCollection: 'Accommodations & Packing',
  festivalOperationsCollection: 'Festival Operations & Procedures',
  foodBeverageCollection: 'Food & Beverage',
  ticketsCollection: 'Tickets',
  musicEntertainmentCollection: 'Music & Entertainment',
  healthAndSafetyCollection: 'Heath & Safety',
};

export const getCategoryData = ({ faqData }) =>
  Object.entries(faqData).reduce((acc, curr) => {
    const [categoryType, categoryQuestions] = curr;
    if (categoryType === '__typename') return acc; // filter out _typename
    const categoryName = mapCategoryTypeToName[categoryType] || categoryType;
    const category = {
      categoryName,
      questions: categoryQuestions.items,
    };
    acc.push(category);
    return acc;
  }, []);
