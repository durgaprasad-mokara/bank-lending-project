def caesar_cipher(text, shift, encode=True):
    if not encode:
        shift = -shift
    result = []
    for c in text:
        if c.isalpha():
            base = ord('A') if c.isupper() else ord('a')
            result.append(chr((ord(c) - base + shift) % 26 + base))
        else:
            result.append(c)
    return ''.join(result)

s= input()
print("Input:",s)
encoded = caesar_cipher(s, 3, True) 
print("Encoded:",encoded)  
decoded = caesar_cipher(encoded, 3, False)  
print("Decoded:",decoded)