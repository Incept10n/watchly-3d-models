toltips feature:

reason: when item is not available it's a good idea to explain to the customer the reason for why a certain part is available.

user stories:
- as a user i want to see tooltips when i cannot choose the element (i understand this by either trying to pick the item which is no available or hover upon the item which is not available, where item is a part which is not available)

non-function requirements:
- this should be the done similarly to the 'modals' feature in the project so that tooltips can be used everywhere any time.
- use styles similar to the ones that are already used, but so that tooltips look good

functional requirements:
- tooltips must appear when hovering unavailable watch part
- proper position must be calculated so that it doesn't overflow the screen

==== regarding part's tooltips

when user hovers on the part which is unavailable, the text should say
copywriting:
'Эта часть недоступна для выбора, так как она не совместима с выбранным <part type, expample "механизмом"> <..name of the part..>, если хотите её использовать, то выбирите другой <part type>, совместимый с этой частью'
