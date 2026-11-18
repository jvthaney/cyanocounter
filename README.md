# Using the Plankton Counters and Food Web Tools

This site contains user-friendly tools for counting plankton (or other taxa) and using those
counts to build a model food web of your lake, which you can then manipulate.

Everything runs in your browser. Nothing is installed, nothing is uploaded, and nothing you
enter leaves your computer unless you download it yourself.

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
- Three ways to get data in:
  - **Send counts directly** from the Food Web Counter with its *Send to Food Web Dashboard* button
  - **Upload a spreadsheet** of taxa and counts
  - **Add each taxon by hand** in the dashboard itself
- Add, remove or adjust any taxon and watch the web change
- Adjust the values under **The Rules** to change how feeding relationships are worked out

---

## What the counters do

- Unlimited counters, each with a taxon name you can change at any time
- Every counter records **what was counted**: cells, colonies or filaments
- An optional **count threshold**, with a progress bar that turns orange when you reach it
- Relative abundance of each taxon, as a table and a chart
- Estimated individuals, colonies or cells per litre of lake water, from your tow depth, net
  diameter and sample volumes
- A spreadsheet of everything, downloadable at any point

---

## Why every counter asks what you counted

A count of "*Microcystis*: 40" cannot be turned into biomass, because 40 cells and 40 colonies
are about eightyfold apart. So each counter asks whether you are tallying **cells**, **colonies**
or **filaments**, and the plus and minus buttons do nothing until you have said which.

Pick the unit that matches what you can actually see and count reliably. For most colonial
cyanobacteria that is colonies; for a filamentous genus such as *Dolichospermum* or
*Aphanizomenon* it is filaments. If you change your mind partway through, start a new counter
rather than switching, because a counter holding a mixture of units cannot be corrected later.

---

## Filling in the sample details

Every box has a **?** beside it. Click it for an explanation of what that box wants; click again
to close. The two that cause the most confusion:

| Box | What it means |
|---|---|
| **Concentrated sample volume (ml)** | How much water you ended up with **after** the tow: the volume in your collection bottle or cylinder, holding the plankton from the whole tow. **Not** the volume of lake water that passed through the net, which is worked out from the tow depth and net diameter instead. |
| **Subsample counted (ml)** | How much of that concentrated sample you put on the slide and counted. On a Sedgewick Rafter cell this is 1 ml. |

Together those two say what fraction of the tow you actually looked at, which is what turns a
tally into a density.

**Squares counted (of 1,000).** A Sedgewick Rafter cell is 50 columns by 20 rows. Count a whole
slide and enter 1000. For part of one, multiply the full rows you finished by 50 and add the
squares in the row you stopped partway through: 5 full rows plus 23 squares is 273.

**Count threshold is optional.** Leave it blank to count the whole slide. If you would rather
stop at a set total, enter it and a progress bar will track your running count. Stopping at 300
gives a counting error of roughly 6 per cent, and at 100 roughly 10 per cent.

Click **Submit info** to record these details. You can change any of them later and click it
again.

---

## Counting

1. Enter the sample details and click **Submit info**.
2. Add a counter for each taxon, set what you are counting, and tally with **+** and **−**.
3. Rename any counter by typing in its name box, including the preset ones.
4. Remove a counter you added by mistake with the **×** in its corner.
5. **Reset counters** zeroes every tally but keeps the taxa, names and units.

---

## When you have finished

**Download Spreadsheet** saves a CSV to your computer with your sample details, the raw counts,
the counting unit for each taxon, and the calculated values. Calculated columns show **—** where
a required detail was left blank. The file is named after you and the date.

**Send to Food Web Dashboard** *(Food Web Counter)* opens the dashboard in a new tab with the
count already loaded, so there is no file to download or upload. The counter is not changed.

A spreadsheet from either counter can also be loaded into the dashboard later with its
**Choose File** button, so a count made last summer still works.

---

## How the numbers are worked out

All density estimates assume the sample was well mixed before the slide was loaded.

| Output | Formula |
|---|---|
| **Per slide** | count ÷ (squares counted ÷ 1,000) |
| **Per litre of lake water** | (per slide ÷ proportion of the sample on the slide) ÷ litres of lake water filtered |
| **Relative abundance (%)** | taxon count ÷ total count × 100 |

Where:
- *proportion of the sample on the slide* = subsample counted (ml) ÷ concentrated sample volume (ml)
- *litres of lake water filtered* = π × (net radius)² × tow depth × 1,000

---

## A note on the food web

The dashboard's links are **predictions, not observations**. A link means that feeding is
physically possible given the sizes involved and the rules in force: that the food falls inside
the consumer's size window, and is not a filament or a colony too large to handle. It does not
mean the interaction has been recorded anywhere.

Size-based rules tend to over-predict, so treat a web as a set of candidate relationships to
examine rather than a result. The trait data behind it is still being assembled, and the
parameters under **The Rules** are a mixture of published values and our own placeholders. Each
one says which it is.
