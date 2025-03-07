from collections import Counter, defaultdict
from scipy.stats import entropy
import random
import pandas as pd
import numpy as np


def group_column(df, col):
    if df[col].dtype in ["int64", "float64"]:
        df[col] = df[col] // 10 * 10
    return df

def supress_column(df, col):

    if col not in df.columns:
        raise ValueError(f"Column '{col}' not found in Table")
    
    df[col] = "[REDACTED]"
    return df

def anonymize_date(df, col, redactDay=False, redactMonth=False, redactYear=False):
    """
    Anonymizes a date column by redacting day, month, or year.

    Parameters:
    - df (pd.DataFrame): Input dataframe.
    - col (str): Column name containing date values.
    - redactDay (bool): If True, replace day with 'XX'.
    - redactMonth (bool): If True, replace month with 'XX'.
    - redactYear (bool): If True, replace year with 'XXXX'.

    Returns:
    - pd.DataFrame: Dataframe with anonymized date column.
    """
    if col not in df.columns:
        raise ValueError(f"Column '{col}' not found in DataFrame.")

    def redact_date(value):
        try:
            date = pd.to_datetime(value, errors='coerce')  # Convert to datetime
            if pd.isna(date):
                return value  # If conversion fails, return original value
            
            year = str(date.year) if not redactYear else "XXXX"
            month = str(date.month).zfill(2) if not redactMonth else "XX"
            day = str(date.day).zfill(2) if not redactDay else "XX"

            return f"{year}-{month}-{day}"
        except Exception:
            return value  # Return as is if parsing fails

    df[col] = df[col].astype(str).apply(redact_date)
    return df


def compute_k_anonymity(df, quasi_identifier_columns=None):
    """
    Calculate the k-anonymity of a pandas DataFrame.
    
    Parameters:
    -----------
    df : pandas.DataFrame
        The DataFrame to analyze
    quasi_identifier_columns : list or None
        List of column names to treat as quasi-identifiers.
        If None, all columns will be treated as quasi-identifiers.
        
    Returns:
    --------
    int
        The k-anonymity value of the DataFrame
    dict
        Additional information about equivalence classes
    """
    # If no quasi-identifier columns are specified, use all columns
    if quasi_identifier_columns is None:
        quasi_identifier_columns = df.columns.tolist()
    
    # Validate that specified columns exist in the DataFrame
    for col in quasi_identifier_columns:
        if col not in df.columns:
            raise ValueError(f"Column '{col}' not found in DataFrame")
    
    # Convert the specified columns to strings to handle different data types
    df_copy = df.copy()
    for col in quasi_identifier_columns:
        df_copy[col] = df_copy[col].astype(str)
    
    # Create a combined key from all quasi-identifier columns
    df_copy['combined_key'] = df_copy[quasi_identifier_columns].apply(
        lambda row: '-'.join(row.values), axis=1
    )
    
    # Count occurrences of each quasi-identifier combination
    equivalence_classes = Counter(df_copy['combined_key'])
    
    # The k-anonymity is the minimum size of any equivalence class
    k = min(equivalence_classes.values()) if equivalence_classes else 0
    
    # Calculate additional information
    total_records = len(df)
    num_equivalence_classes = len(equivalence_classes)
    max_class_size = max(equivalence_classes.values()) if equivalence_classes else 0
    avg_class_size = total_records / num_equivalence_classes if num_equivalence_classes > 0 else 0
    
    # Identify the equivalence classes that determine the k value
    smallest_classes = [key for key, count in equivalence_classes.items() if count == k]
    
    # Prepare the result
    result = {
        'k_anonymity': k,
        'total_records': total_records,
        'num_equivalence_classes': num_equivalence_classes,
        'max_class_size': max_class_size,
        'avg_class_size': avg_class_size,
        'smallest_classes': smallest_classes,
        'equivalence_class_distribution': dict(equivalence_classes)
    }
    
    return k, result


def calculate_i_diversity(df, columns=None, base=None):
    """
    Calculate the i-diversity of a pandas DataFrame.
    
    I-diversity is a measure of diversity based on information theory principles,
    calculated as the average Shannon entropy across specified columns.
    
    Parameters:
    -----------
    df : pandas.DataFrame
        The input DataFrame to calculate i-diversity on.
    columns : list, optional
        List of column names to include in the calculation.
        If None, all columns will be used.
    base : float, optional
        The logarithmic base to use for entropy calculation.
        If None, natural logarithm (base e) is used.
        
    Returns:
    --------
    float
        The i-diversity value of the DataFrame.
    dict
        A dictionary containing the entropy for each column.
    """
    # If columns not specified, use all columns
    if columns is None:
        columns = df.columns
    
    # Check if columns exist in dataframe
    for col in columns:
        if col not in df.columns:
            raise ValueError(f"Column '{col}' not found in DataFrame")
    
    # Calculate entropy for each column
    entropies = {}
    for col in columns:
        # Get value counts as probabilities
        value_counts = df[col].value_counts(normalize=True)
        
        # Calculate Shannon entropy
        col_entropy = entropy(value_counts, base=base)
        entropies[col] = col_entropy
    
    # Calculate i-diversity as the average entropy
    i_diversity = np.mean(list(entropies.values()))
    
    return i_diversity, entropies


def redact_zipcode(df, column_name):
    """
    Redact zipcode/pincode data from a specified column in a pandas DataFrame.
    
    Redaction rules:
    - If pincode is 5 digits, redact the last 2 digits
    - If pincode is any other length, redact the last 3 digits
    
    Parameters:
    -----------
    df : pandas.DataFrame
        The input DataFrame containing the data.
    column_name : str
        The name of the column containing zipcode/pincode data to be redacted.
        
    Returns:
    --------
    pandas.DataFrame
        A new DataFrame with the zipcode/pincode data redacted.
    """
    
    if column_name not in df.columns:
        raise ValueError(f"Column '{column_name}' not found in DataFrame")
    
    
    def redact_code(code):
        code = str(code)
        if len(code) == 5:
            return code[0:3] + "XX"
        else:
            return code[0:len(code)-3] + "XXX"
    
    
    df[column_name] = df[column_name].apply(redact_code)
    
    return df

def calculate_m_invariance(df, quasi_identifier_columns=None, sensitive_columns=None):
    """
    Calculate the m-invariance of a pandas DataFrame.
    
    By default, all columns are considered both quasi-identifiers and sensitive attributes.
    
    M-invariance is a privacy metric that ensures each combination of quasi-identifier values
    appears with at least m distinct sensitive attribute values, and the set of sensitive values
    remains the same across different releases of the data.
    
    Parameters:
    -----------
    df : pandas.DataFrame
        The input DataFrame to calculate m-invariance on.
    quasi_identifier_columns : list, optional
        List of column names that serve as quasi-identifiers.
        If None, all columns are used as quasi-identifiers.
    sensitive_columns : list, optional
        List of column names that contain sensitive information.
        If None, all columns are used as sensitive attributes.
        
    Returns:
    --------
    dict
        A dictionary containing:
        - 'm_value': The minimum number of distinct sensitive values in any QI group
        - 'qi_group_counts': Dictionary mapping QI combinations to their counts
        - 'is_m_invariant': Boolean indicating if the dataset satisfies m-invariance
        - 'min_required_m': The minimum m value needed for full m-invariance
    """
    
    if quasi_identifier_columns is None:
        quasi_identifier_columns = df.columns.tolist()
    
    if sensitive_columns is None:
        sensitive_columns = df.columns.tolist()
    
    
    all_columns = list(set(quasi_identifier_columns + sensitive_columns))
    for col in all_columns:
        if col not in df.columns:
            raise ValueError(f"Column '{col}' not found in DataFrame")
    
    df_copy = df.copy()
    
    for col in quasi_identifier_columns:
        df_copy[col] = df_copy[col].astype(str)
    
    df_copy['qi_group'] = df_copy[quasi_identifier_columns].apply(
        lambda row: '_'.join(row), axis=1
    )
    
    qi_group_counts = defaultdict(set)
    
    for _, row in df_copy.iterrows():
        qi_group = row['qi_group']
        sensitive_value = tuple(row[sensitive_columns].astype(str))
        qi_group_counts[qi_group].add(sensitive_value)
    
    sensitive_counts = {qi: len(values) for qi, values in qi_group_counts.items()}
    
    if not sensitive_counts:
        return {
            'm_value': 0,
            'qi_group_counts': {},
            'is_m_invariant': False,
            'min_required_m': 0
        }
    
    m_value = min(sensitive_counts.values())
    max_m = max(sensitive_counts.values())
    
    # Determine if the dataset satisfies m-invariance
    # This is true if all QI groups have at least m distinct sensitive values
    # and all QI groups have the same set of sensitive values (for simplicity, we check count equality)
    is_m_invariant = all(count == m_value for count in sensitive_counts.values())
    
    min_required_m = max_m
    
    # result = {
    #     'm_value': m_value,
    #     'qi_group_counts': {qi: len(values) for qi, values in qi_group_counts.items()},
    #     'is_m_invariant': is_m_invariant,
    #     'min_required_m': min_required_m
    # }
    
    return m_value, is_m_invariant, min_required_m


def add_synthetic_numerical_column(df, column_name, lower_limit, upper_limit, datatype='int'):
    """
    Add a new column to a pandas DataFrame with random values between the specified limits.
    
    Parameters:
    -----------
    df : pandas.DataFrame
        The input DataFrame to add the column to.
    column_name : str
        The name of the new column to create.
    lower_limit : int or float
        The lower limit for random values (inclusive).
    upper_limit : int or float
        The upper limit for random values (inclusive for int, exclusive for float).
    datatype : str, optional
        The data type of the random values, either 'int' or 'float'. Default is 'int'.
        
    Returns:
    --------
    pandas.DataFrame
        The DataFrame with the new column added.
    """
    
    result_df = df.copy()
    
    
    num_rows = len(result_df)
    
    if datatype == 'int':
        random_values = np.random.randint(lower_limit, upper_limit + 1, size=num_rows)
    else:
        random_values = np.random.uniform(lower_limit, upper_limit, size=num_rows)
    
    
    result_df[column_name] = random_values
    
    return result_df


def add_synthetic_categorical_column(df, column_name, string_list):
    """
    Add a new column to a pandas DataFrame with random values selected from a provided list of strings.
    Each row receives an independently selected random value from the list.
    
    Parameters:
    -----------
    df : pandas.DataFrame
        The input DataFrame to add the column to.
    column_name : str
        The name of the new column to create.
    string_list : list
        A list of strings from which to randomly select values.
        
    Returns:
    --------
    pandas.DataFrame
        The DataFrame with the new column added.
    """
    
    result_df = df.copy()
    
    string_list = string_list[0].split(",")

    num_rows = len(result_df)
    print(string_list)
    random_values = np.random.choice(string_list, size=num_rows, replace=True)
    
    result_df[column_name] = random_values
    
    return result_df