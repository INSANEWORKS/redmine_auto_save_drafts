# Redmine Auto Save Drafts Plugin

**Redmine Auto Save Drafts** is a plugin for Redmine that automatically saves your input in tickets and comments, ensuring that your work is never lost due to accidental browser closures or navigation. It restores drafts seamlessly without requiring user intervention.

## Features

- Automatically saves ticket descriptions, subjects, and comments locally in the browser.
- Restores drafts automatically without user confirmation.
- Displays "Saved (n seconds ago)" messages dynamically to keep users informed.
- Uses Web Storage (localStorage) for privacy and efficiency.
- Removes saved drafts upon successful form submission.

## Installation

1. Navigate to your Redmine plugins directory:

   ```bash
   cd /path/to/redmine/plugins
   ```

2. Clone the repository:

   ```bash
   git clone https://github.com/INSANEWORKS/redmine_quickdrafts.git redmine_quickdrafts
   ```

3. Restart your Redmine application:

## Usage

1. Navigate to any ticket creation, editing, or commenting page in Redmine.
2. Begin typing in the subject, description, or comment fields.
3. Your input will be automatically saved locally every time you make changes.
4. If you navigate away from the page and return, your unsaved draft will be automatically restored.

Localization
## Localization

- Supports Japanese.
- Currently, other languages are hard-coded into Javascript, so you will need to directly edit the files.

## Compatibility

- Tested with Redmine 6.x
- Older versions might not be fully supported.

## License

This plugin is licensed under the MIT License. See LICENSE for details.
