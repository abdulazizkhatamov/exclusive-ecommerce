import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";

interface FiltersSidebarProps {
  priceList: number[];
  tempPriceRange: [number, number];
  setTempPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  setFilterApplied: React.Dispatch<React.SetStateAction<boolean>>;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({
  priceList,
  tempPriceRange,
  setTempPriceRange,
  setPriceRange,
  setFilterApplied,
}) => {
  const handleSliderChange = (newValues: [number, number]) => {
    setTempPriceRange(newValues); // Update the temp slider range without applying the filter
  };

  const handleFilterClick = () => {
    console.log(tempPriceRange);
    setPriceRange(tempPriceRange); // Apply the current slider value as the price range
    setFilterApplied(true); // Apply the filter when the button is clicked
  };

  return (
    <aside className="w-full md:w-64 p-6 border-r">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      <Accordion
        defaultValue={"item-1"}
        type="single"
        collapsible
        className="w-full"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="my-2 mx-[1px]">
              <Slider
                value={tempPriceRange} // Use the temporary price range for the slider
                minStepsBetweenThumbs={1}
                max={Math.max(...priceList)}
                min={0}
                step={1}
                onValueChange={handleSliderChange} // Update the temp range when slider value changes
                className={"w-full"}
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>${tempPriceRange[0]}</span>
                <span>${tempPriceRange[1]}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <button
        className="mt-4 bg-primary_red text-white py-2 px-4 rounded"
        onClick={handleFilterClick} // Apply the filter when button is clicked
      >
        Apply Filter
      </button>
    </aside>
  );
};

export default FiltersSidebar;
