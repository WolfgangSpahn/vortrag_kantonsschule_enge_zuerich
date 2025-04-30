import matplotlib.pyplot as plt
import matplotlib.patches as patches
import matplotlib.patheffects as pe
import numpy as np

# pallette of 12 colors
colors = plt.cm.tab20.colors
# Parameters
num_layers = 12
tokens = ['[the]', '[ e]', '[iffel]', '[ tower]', '[ is]', '[ located]', '[ in]']
seq_length = len(tokens)  # Dynamically set seq_length based on tokens
hidden_size = 768  # not visualized dimensionally, just implied

token_positions = list(range(len(tokens)))

accum_is = ['is built high', 'is built high', 'is built high, in Paris',
            'is built high, in Paris', 'is built high, in Paris', 'is built high, in Paris']
accum_is_positions = [5, 6, 7, 8, 9, 10, 11]

accum_in = ['is in?','is in?','is in?','is in Paris']
accum_in_positions = [8,9,10,11]

# Right-align the tokens in the context window
start_index = seq_length - len(tokens)

# Ensure tokens fit within the new context window
if start_index < 0:
    tokens = tokens[-seq_length:]
    start_index = 0

# Plot setup
fig, ax = plt.subplots(figsize=(10, 6))
ax.set_xlim(-0.5, seq_length + 0.5)
ax.set_ylim(-0.3, num_layers)  # even smaller margin below
ax.axis('off')

# Box size
box_width = 0.8
box_height = 0.8 / 4  # one third the original height

# Draw black rectangles for each (layer, token)
for layer in range(num_layers):
    for token in range(seq_length):
        rect = patches.Rectangle(
            (token + (1 - box_width) / 2, layer + (1 - box_height) / 2),
            box_width,
            box_height,
            linewidth=0.5,
            # use pallette of 12 colors
            edgecolor=colors[layer % 12],
            facecolor=colors[layer % 12]
        )
        ax.add_patch(rect)

# Draw token labels under Layer 1, aligned to the right
for i, token in enumerate(tokens):
    token_index = start_index + i
    ax.text(
        token_index + 0.5,  # x position (centered under the box)
        0.3,              # y position very close to the box
        token,
        ha='center',
        va='top',
        fontsize=18,
        fontweight='bold',
        color='red'
    )

# Draw arrows between tokens
for layer in range(num_layers-1):
    y_pos = 0.8 + layer
    from_index = 0
    # Draw a horizontal arrow from [the] to [ e] just above the boxes
    for i, target_token in enumerate(tokens):
        if target_token == '[the]':
            continue
        to_index = start_index + i
        ax.annotate(
            '',
            xy=(to_index + 0.5, y_pos + i / 20.),
            xytext=(from_index + 0.5, y_pos + i / 20.),
            arrowprops=dict(arrowstyle='->', color='gray', lw=1.5)
        )
# Draw a vertical arrow from one layer to the next
for layer in range(num_layers):
    for token in range(seq_length):
        ax.annotate(
            '',
            xy=(token + 0.5, layer + 1.3),
            xytext=(token + 0.5, layer + 0.7),
            arrowprops=dict(arrowstyle='->', color='black', lw=1.5)
        )

# Draw text labels for 'is' tokens
for i, token in enumerate(accum_is):
    token_index = accum_is_positions[i]
    ax.text(
        4.5, token_index + 1.2,
        token,
        ha='center',
        va='top',
        fontsize=16,
        color='white',  # font color
        bbox=dict(facecolor='black', edgecolor='none', boxstyle='round,pad=0.3')  # background
    )

# Draw text labels for 'Paris' tokens
for i, token in enumerate(accum_in):
    token_index = accum_in_positions[i]
    ax.text(
        6.5, token_index + 0.2,
        token,
        ha='center',
        va='top',
        fontsize=16,
        color='white',  # font color
        bbox=dict(facecolor='red', edgecolor='none', boxstyle='round,pad=0.3')  # background
    )

# Draw to the top right the word '[Paris]'

ax.text(
    seq_length + 0.7, 11.65,
    ' => [Paris]',
    ha='center',
    va='top',
    fontsize=16,
    fontweight='bold',
    color='red'
)

# Draw box at 1,1 with 1,1 dimensions
rect = patches.Rectangle(
    (6.25, 0.75),
    0.5,
    0.5,
    # dashed line
    linestyle='--',
    linewidth=2,
    edgecolor='red',
    facecolor='none'
)
ax.add_patch(rect)
# Draw text label for the box
ax.text(
    6.5, 1.2,
    'Vector\nMaschine',
    ha='center',
    va='top',
    fontsize=12,
    color='red'
)

# Ticks and grid
ax.set_xticks(range(0, seq_length, 4))
ax.set_yticks(range(0, num_layers))
ax.set_yticklabels([f"Layer {i+1}" for i in range(num_layers)])
ax.grid(False)

plt.tight_layout()
plt.show()
