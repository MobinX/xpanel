export function getLanguageForFileName(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || ''; // Get the extension and lowercase it
  
    switch (extension) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'html': 
      case 'htm':
        return 'html';
      case 'css':
        return 'css'; 
      case 'scss':
        return 'scss';
      case 'less':
        return 'less';
      case 'json':
        return 'json';
      case 'py':
        return 'python'; 
      case 'java':
        return 'java';
      case 'cpp': // For C++
      case 'c':   // For C
        return 'cpp'; 
      case 'go':
        return 'go';
      case 'php':
        return 'php';
      case 'rb': 
        return 'ruby'; 
      case 'swift':
        return 'swift';
      case 'kt': 
      case 'kts':
        return 'kotlin';
      case 'rs':
        return 'rust';
      case 'pl':
        return 'perl'; 
      case 'sql':
        return 'sql';
      case 'graphql': 
      case 'gql':
        return 'graphql';
      case 'sh': // For Bash
      case 'bash':
        return 'bash';
      case 'ps1': 
        return 'powershell'; 
      case 'dockerfile':
        return 'dockerfile';
      case 'yaml': 
      case 'yml':
        return 'yaml'; 
      case 'md': 
      case 'markdown':
        return 'markdown';
      // Add more cases for other languages as needed 
      default:
        return 'plaintext'; // Default to plain text
    }
  }
