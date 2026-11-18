# Using the Plankton Counters and Food Web Tools

This site contains user-friendly tools designed for counting plankton (or other taxa) and using 
these data to build a model food web of your lake, which you can manipulate.

---
## General functions of counters

- Add unlimited counters and input taxonomic names (rename any time)
- Supports using a <i>count threshold</i> you can set (e.g., stop when you've counted 300 colonies), and a progress bar that tracks your running total and alerts you you reach the threshold
- Calculates and plots relative abundance of each taxon in the sample
- Calculates and plots estimated colonies/cells/individuals per liter lake water based on your inputs of sample depth, plankton-net ring diameter, and volume of subsample counted
---

## Quick guide to tool differences

**Cyano Counter**
- <b>Specifically for cyanobacteria, preset with common taxa on the counters </b>(with options to rename them or add more)
- Designed for community science cyanobacterial monitoring  
- The **View** button on each counter opens an identification image for that taxon



**Food Web Counter**
- <b>For counting any plankton, or other taxa</b>
- Add unlimited counters for phytoplankton, zooplankton, or other taxa


**Food Web Dashboard**
- <b>Build a food web based on your taxa and counts</b>
-   Several ways to enter data:
    1. <b>Send count data directly</b> from the Food Web Counter to the dashboard using the "Send to Food Web Dashboard" button
    2. <b>Upload a spreasheet</b> with taxa and counts to the dashbaord
    3. <b>Manually add each taxon</b> and count value to the dashboard
    
- Add, remove, or adjust the counts of any taxa and watch the visual representation of your food web change
- Adjust values in the "The Rules" section to change how the dashboard calculates trophic relationships


---

## How to use the tools

**1.** Open the [Plankton Counter homepage](https://jvthaney.github.io/cyanocounter/).

**2.** Select the tool you wish to use from the top navigation bar (Cyano Counter, Food Web Counter, or Food Web Dashboard).

**3.** Enter your session metadata in the fields at the top of the page:
- **Name** of the person counting
- **Date** and **time** of sample collection
- **Location** and **coordinates** (lat/lon)

**4a. Cyano Counter and Food Web Counter** — enter the additional fields needed for density calculations:
- **Volume sample (ml):** the volume of your concentrated net sample, measured in the graduated cylinder
- **Depth sampled (m):** the depth of the plankton tow (used to calculate volume of lake water sampled)
- **Net diameter (m):** the diameter of the net ring (used to calculate volume of lake water sampled)
- **Rows counted:** the number of rows of the Sedgewick Rafter cell you traversed (used to estimate the proportion of the slide counted; the cell has 20 rows total)
- **Subsample vol (ml):** the volume loaded onto the Sedgewick Rafter cell (typically 1 ml)
- **Count threshold** *(PlanktonCounter only)*: the total number of colonies/organisms at which you stop counting. Leaving this blank means you count the full slide. Setting it to 300 yields an estimated counting error of ~5.8% (CV = 1/√N).

**4b. TaxonCounter** — enter the **area sampled** (m²), if applicable.

**5.** Add any **notes** that may be useful later — e.g., weather conditions, visible bloom, water colour, other taxa observed.

**6.** Click **"Submit Info"** to log this information. You can update any field at any time — just click Submit Info again after making changes.

![inputboxes](https://user-images.githubusercontent.com/70969187/176552968-6019b738-1148-4012-b2e7-2c10e39c76a1.jpg)

**7.** Click **"Add counter +"** for each new taxon you encounter. Enter the taxon name in the field on the counter card, then use **+** and **−** to tally colonies or filaments as you traverse the slide.

- Count **colonies or filaments as single units**, not individual cells — size variation between colonies will be corrected in a separate biovolume step
- The running count is shown at the bottom of each coloured card
- If you added a counter by mistake, click the **×** in the top-right corner of the card to remove it
- If you need to zero all counts and start over, click **"Reset counters"**

*(PlanktonCounter only)* If you entered a count threshold, a progress bar above the counters tracks your total. When it turns orange, you have reached your threshold — stop counting or continue to complete the full slide, then click Export Data.

![counters](https://user-images.githubusercontent.com/70969187/176551703-295a934c-6d17-492e-bbc3-946300a0499f.jpg)

**8.** When finished, click **"Export data"** to download your results as a .CSV file.

- The file contains your raw counts, all metadata fields, and calculated values (colonies/slide, colonies/L, relative abundance %)
- Calculated columns will show **—** if the required metadata fields were left blank
- The filename is set automatically as `[your name]_[date].csv`
- A live preview of the data table is always visible at the bottom of the page

![previews](https://user-images.githubusercontent.com/70969187/175312583-ae56c976-11f3-4052-8db4-45efced83cb8.jpg)

---

## Notes on calculations (CyanoCounter and PlanktonCounter)

All density estimates assume the sample was well-mixed before loading the slide.

| Output | Formula |
|---|---|
| **Colonies/slide** | Count ÷ (rows counted / 20) |
| **Colonies/L lake water** | (Colonies/slide ÷ proportion of sample on slide) ÷ volume of lake water sampled (L) |
| **Relative abundance (%)** | Taxon count ÷ total count × 100 |

Where:
- *Proportion of sample on slide* = subsample volume (ml) ÷ total sample volume (ml)
- *Volume of lake water sampled* = π × (net radius)² × depth × 1000 (converts m³ to L)
 