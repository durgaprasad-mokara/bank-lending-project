def format_to_indian_currency(num):
    num_str = str(num)
    if '.' in num_str:
        integer_part, decimal_part = num_str.split('.')
    else:
        integer_part, decimal_part = num_str, ''
    last_three = integer_part[-3:]
    other_numbers = integer_part[:-3]

    if other_numbers != '':
        parts = []
        while len(other_numbers) > 2:
            parts.insert(0, other_numbers[-2:])
            other_numbers = other_numbers[:-2]
        if other_numbers:
            parts.insert(0, other_numbers)
        formatted_integer = ','.join(parts) + ',' + last_three
    else:
        formatted_integer = last_three

    return formatted_integer + ('.' + decimal_part if decimal_part else '')
    
number = 123456.7891
formatted = format_to_indian_currency(number)
print(formatted)