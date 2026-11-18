# Using the Plankton Counters and Food Web Tools

This site contains user-friendly tools for counting plankton (or other taxa) and using those
counts to build a model food web of your lake, which you can then change and manipulate.

---

## Quick guide to the tools

**[Cyano Counter](https://jvthaney.github.io/cyanocounter/cyano.html)**
- Specifically for cyanobacteria, preset with common taxa on the counters, which can be renamed
  or added to
- Designed for community science cyanobacterial monitoring
- The **View** button on each counter opens an identification guide for that taxon

**[Food Web Counter](https://jvthaney.github.io/cyanocounter/FoodWeb.html)**
- For counting any plankton, or any other taxa
- Add as many counters as you need for phytoplankton, zooplankton or other taxa
- Counts can be sent straight to the Food Web Dashboard

**[Food Web Dashboard](https://jvthaney.github.io/cyanocounter/dashboard.html)**
- Builds a food web from your taxa and counts
- Three ways to enter data:
  - **Send counts directly** from the Food Web Counter by clicking the *Send to Food Web Dashboard* button
  - **Upload a spreadsheet** of taxa and counts
  - **Add each taxon by hand** in the dashboard itself
- Add, remove, or adjust any taxon and watch the food web change
- Adjust values under The Rules to change how feeding relationships are calculated


---

## Features of the Counters

- Allow you to add unlimited counters, each with a taxon name you can change at any time
- Record what was counted: cells, colonies, filaments, or individuals
- Optional count threshold if you chose to use it, with a progress bar that alerts you when you reach it
- Estimate and plot relative abundance of each taxon
- Estimate and plot individuals, colonies, or cells per litre of lake water, derived from your tow depth, net
  diameter, and sample volumes
- Download a spreadsheet of the data (or optionally send the data to the food web dashboard)


---

## Entering the sample metadata

Before you start counting, fill out the metadata to save important information about your sample. NOTE: Every box has a **?** beside it that opens this same explanation on the page itself.

*Metadata Field Explanations*

- **Your name**: Who did the counting. Used to record who to ask about the count later.
- **Date collected**: The day the sample was collected from the lake (not the day you counted it).
- **Time collected**: Roughly the time when the sample was taken. Plankton often move throughout the day, so the time of a tow can affect what is in it.
- **Sampling location**: The name of the water body and the rough location within it (e.g., a station name, a landmark, the deep hole, etc.). 
- **Latitude**: In decimal degrees. A phone's map app will give you this if you press and hold on your location. *(e.g. 43.385787)*
- **Longitude**: In decimal degrees, negative west of Greenwich, so negative throughout North America. *(e.g. -72.08125)*
- **Tow depth (m)**: How deep you lowered the net for the tow. Combined with the net diameter, this gives the volume of lake water the tow filtered. 
- **Number of tows**: How many separate tows went into this sample (e.g., if you combined three tows into the same bottle, enter 3). 
- **Net ring diameter (m)**: The width of the mouth of the plankton net, across the metal ring (e.g., a common size is 0.16 m). 
- **Concentrated sample volume (ml)**: This is how much water you ended up with AFTER the tow; the volume in your collection bottle, with the plankton from the whole tow concentrated into it. This is NOT the volume of lake water that passed through the net - that is calculated from the tow depth and net diameter. 
- **Subsample counted (ml)**: How much of that concentrated sample you put on the slide and counted. On a Sedgewick Rafter cell this is 1 ml. Together with the concentrated sample volume this tells us what fraction of the tow you looked at.
- **Squares counted** *(optional)*: If using a Sedgewick Rafter slide: it is 50 columns across and 20 rows down, so 1,000 squares total. If you counted part of a slide, enter the number of squares you counted. Or, multiply the full rows you finished by 50 and add the squares in the row you stopped partway through (e.g., 5 full rows plus 23 squares = 273).
- **Count threshold** *(optional)*: If you would rather stop at a set number of counts, enter it here and a progress bar will track your running count and turn orange when you reach it. Stopping at 300 gives a counting error of about 6 per cent; stopping at 100 about 10 per cent. *(e.g. blank, or 300)*
- **Notes**: Other details about the sample (e.g., weather, a visible bloom, water colour, notes on your identifications, etc.).



---

## Counting

1. Enter the metadata. You can update these details any time and it will save automatically to your count spreadsheet. 
2. Add a counter for each taxon, set what you are counting, and tally with the **+** and **−** buttons.
3. Rename any counter by typing in its name box.
4. Remove a counter you added by mistake with the **×** in its corner.
5. **Reset counters** zeroes every tally but keeps the taxa, names and units. 

---

## When you have finished counting

**Download Spreadsheet** saves a CSV to your computer with your sample details, the raw counts,
the counting unit for each taxon, and the calculated values. Calculated columns show **—** where
a required detail was left blank. The file is named after you and the date.

**Send to Food Web Dashboard** opens the food web dashboard in a new tab with the
counts already loaded, so there is no file to download or upload. The counter is not changed.

A spreadsheet with count data can also be loaded into the dashboard later using the
**Choose File** button.

---

## Density estimates 

At the bottom of the counter page, it automatically estimates the relative abundance and density of taxa in your sample, based on the metadata:

| Estimate | Formula |
|---|---|
| **Per slide** | count ÷ (squares counted ÷ 1,000) |
| **Per litre of lake water** | (per slide ÷ proportion of the sample on the slide) ÷ litres of lake water filtered |
| **Relative abundance (%)** | taxon count ÷ total count × 100 |

Given that:
- *Proportion of the sample on the slide* = subsample counted (ml) ÷ concentrated sample volume (ml)
- *Litres of lake water filtered* = π × (net radius)² × tow depth × 1,000

---

## Food Web Dashboard

Importantly, the links bewteen taxa in the food webs generated by the dashboard are predictions based on averages and published data, not observations. A link bewteen two taxa means that feeding is
physically possible given the sizes involved and the rules set. A link is drawn if prey falls inside
the consumer's size window, or is not a filament or a colony that is generally too large to handle. It does not
mean this trophic interaction is necessarily occuring in this system.

Each food web output should be treated as a set of candidate relationships to
examine further. The trait data used to generate the food webs are still being assembled and expanded, and the
parameters under **The Rules** are a combination of published values and placeholders. All values can be adjusted and each one says which it is.
