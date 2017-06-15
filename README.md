# abbreviate-number
Javascript module to abbreviate number (3.7K, 7.8M, etc.)

## `abbreviate(n, [params])`

Examples:

`abbreviate(12345)` returns `12.3K`

`abbreviate(12345,{maxFractionalDigits:2,meaningfulDigits:4})` returns `12.35K`.

The main important setting is how many maximum fractional digits you want to see when it make sense to show that level of granularity: `maxFractionalDigits`.

By default, it's set to return up to 1 fractional digit (decimal).

Exemple: 7.3K, 0.1, 23.1

You can then control the level of precision of the overall abbreviation by setting the number of meaningful digits: `meaningfulDigits`.

This is just a desired value and it's only enforce when it makes sense. For example, if you set the number if meaningful digits to 2 and the number to abbreviate is 567, you will get 567 (and not 560).

The desired number of meaningful digits is basically used to determine whether or not there is room for showing a fractional part, and if yes how many fractional digits (up to a max of what is specificed by `maxFractionalDigits`).

Addtionally you can sepcify a threshold below which no abbreviation takes place: `noAbbrevUnder`.

Example:
`abbreviate(12345,{noAbbrevUnder:1000000})` returns `12,345`.

You can turn off commas by setting `addCommas` to false.

You can force the abbreviation to be done within a specific unit, for example express all your numbers in "K":

`abbreviate(1234567,{forceUnit:"K"})` returns `1,235K`.

Note that numbers are always rounded to the nearest value, that's why in the previous example the return value is `1,235K` and not `1,234K`.

The default settings are meant to be what's needed in most analytics number display usage.

## Use-Case: Rounding percentages
Default settings works fine for rounding/abbreviating percentages. Because all values except 100% and above only have 2 digits, the default settings mean that 1 fractional digit will always be shown (unless it's zero):
`0.7%`, `1.3%`, `43.8%`, `99.5%`

If you want such precision in lower values (below 10) but no decimals above 10, you can set `meaningfulDigits` to `2`:
`abbreviate(43.85,{meaningfulDigits:2}` returns `44`
`abbreviate(0.52,{meaningfulDigits:2}` returns `0.5`

## More info

The `test/test.js` unit tests will show you many examples.