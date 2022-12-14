import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Article from "./Article";

export default function Countries() {
  const [countries, setCountries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [toggle, setToggle] = useState(false);
  const [message, setMessage] = useState("");
  const regions = [
    {
      name: "Europe",
    },
    {
      name: "Asia",
    },
    {
      name: "Africa",
    },
    {
      name: "Oceania",
    },
    {
      name: "Americas",
    },
    {
      name: "Antarctica",
    },
  ];

  useEffect(() => {
    const getCountries = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        const data = await res.json();
        setCountries(data.slice(0, 10));
      } catch (error) {
        console.error(error);
      }
    };

    getCountries();
  }, []);

  async function searchCountry() {
    try {
      const res = await fetch(
        `https://restcountries.com/v3.1/name/${searchText}`
      );
      const data = await res.json();
      if (data.status === 404) {
        return setToggle(true), setMessage("Your search yielded no result");
      }
      setToggle(false);
      setCountries(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function filterByRegion(region) {
    try {
      const res = await fetch(
        `https://restcountries.com/v3.1/region/${region}`
      );
      const data = await res.json();
      setCountries(data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    searchCountry();
  }

  function handleFilter(e) {
    e.preventDefault();
    filterByRegion();
  }

  const handleReload = () => {
    window.location.reload() 
  }

  return (
    <>
      {" "}
      {!countries ? (
        <h1 className="text-gray-900 font-bold uppercase tracking-wide flex items-center justify-center text-center h-screen text-4xl">
          Loading...
        </h1>
      ) : (
        <section className="container mx-auto p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between mb-8">
            <form
              onSubmit={handleSearch}
              autoComplete="off"
              className="max-w-4xl md:flex-1"
            >
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search for a country"
                required
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="py-3 px-4 text-gray-600 w-full placeholder-gray-600 rounded shadow outline-none dark:text-gray-400 dark:placeholder-gray-400 dark:bg-gray-800 dark:focus:bg-gray-700 transition-all duration-200"
              />
            </form>

            <form onSubmit={handleFilter}>
              <select
                name="filter-by-region"
                id="filter-by-region"
                className="w-52 py-3 px-4 outline-none shadow rounded text-gray-600 dark:text-gray-400 dark:bg-gray-800 dark:focus:bg-gray-700"
                value={regions.name}
                onChange={(e) => filterByRegion(e.target.value)}
              >
                {regions.map((region, index) => (
                  <option key={index} value={region.name}>
                    {region.name}
                  </option>
                ))}
              </select>
            </form>
          </div>
          {!toggle ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {countries.map((country) => (
                <Article key={country.name.common} {...country} />
              ))}
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between px-8 py-8 max-w-5xl  border-x-4 shadow rounded">
                <div className=" text-gray-200 text-2xl">{message}</div>

                <div >
                  <div onClick={handleReload}
                   
                    className=" inline-block p-0 bg-white lg:py-2 px-8 text-gray-700 hover:bg-gray-200 transition-all duration-200 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-400"
                  >
                    &larr; Go Back
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      )}
    </>
  );
}
