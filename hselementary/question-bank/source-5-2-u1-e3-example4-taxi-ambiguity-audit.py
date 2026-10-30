"""Compare two policies not distinguished by the printed wording."""
base_distance=1000; distance=8475; unit=100; base=3300; price=200
extra=distance-base_distance
full,tail=divmod(extra,unit)
assert (full,tail)==(74,75)
completed=base+full*price
partial_started=base+(full+(tail>0))*price
assert completed==18100 and partial_started==18300
print('Completed 100m segments:',completed,'won; count started partial segment:',partial_started,'won')
