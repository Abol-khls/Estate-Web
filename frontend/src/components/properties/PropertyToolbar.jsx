import PropertyFilters from "./PropertyFilters";

export default function PropertyToolbar({

    search,
    setSearch,

    propertyType,
    setPropertyType,

    transactionType,
    setTransactionType,

    favoriteOnly,
    setFavoriteOnly,

    ordering,
    setOrdering

}) {

    return (

        <PropertyFilters

            search={search}
            setSearch={setSearch}

            propertyType={propertyType}
            setPropertyType={setPropertyType}

            transactionType={transactionType}
            setTransactionType={setTransactionType}

            favoriteOnly={favoriteOnly}
            setFavoriteOnly={setFavoriteOnly}

            ordering={ordering}
            setOrdering={setOrdering}

        />

    );

}