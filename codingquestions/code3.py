def get_left_position(item):
    return item["positions"][0]

def combine_lists(list1, list2):
    combined = list1 + list2
    combined.sort(key=get_left_position)
    
    result = []
    for item in combined:
        if not result:
            result.append(item)
            continue
        
        last = result[-1]
        l1, r1 = last["positions"]
        l2, r2 = item["positions"]
        
        overlap = min(r1, r2) - max(l1, l2)
        width = min(r1 - l1, r2 - l2)
        
        if overlap > 0.5 * width:
            last["values"] += item["values"]
        else:
            result.append(item)
    
    return result

list1 = [
    {"positions": [2, 6], "values": [1, 2]},
    {"positions": [10, 14], "values": [5]},
]

list2 = [
    {"positions": [3, 5], "values": [3]},
    {"positions": [12, 16], "values": [6]},
    {"positions": [20, 22], "values": [7]},
]

output = combine_lists(list1, list2)
for item in output:
    print(item)