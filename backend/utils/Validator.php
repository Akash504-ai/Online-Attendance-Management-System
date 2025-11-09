<?php
/**
 * Input Validation Helper Class
 */

class Validator {
    private $errors = [];
    private $data = [];
    
    public function __construct($data) {
        $this->data = $data;
    }
    
    public function required($fields) {
        foreach ($fields as $field) {
            if (!isset($this->data[$field]) || trim($this->data[$field]) === '') {
                $this->errors[$field] = ucfirst($field) . ' is required';
            }
        }
        return $this;
    }
    
    public function email($field) {
        if (isset($this->data[$field]) && !filter_var($this->data[$field], FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field] = 'Invalid email format';
        }
        return $this;
    }
    
    public function min($field, $length) {
        if (isset($this->data[$field]) && strlen($this->data[$field]) < $length) {
            $this->errors[$field] = ucfirst($field) . " must be at least {$length} characters";
        }
        return $this;
    }
    
    public function max($field, $length) {
        if (isset($this->data[$field]) && strlen($this->data[$field]) > $length) {
            $this->errors[$field] = ucfirst($field) . " must not exceed {$length} characters";
        }
        return $this;
    }
    
    public function in($field, $values) {
        if (isset($this->data[$field]) && !in_array($this->data[$field], $values)) {
            $this->errors[$field] = ucfirst($field) . ' must be one of: ' . implode(', ', $values);
        }
        return $this;
    }
    
    public function unique($field, $table, $column = null, $excludeId = null) {
        if (!isset($this->data[$field])) {
            return $this;
        }
        
        $column = $column ?? $field;
        $db = Database::getInstance();
        
        $sql = "SELECT COUNT(*) as count FROM {$table} WHERE {$column} = :value";
        $params = ['value' => $this->data[$field]];
        
        if ($excludeId) {
            $sql .= " AND id != :id";
            $params['id'] = $excludeId;
        }
        
        $result = $db->fetchOne($sql, $params);
        
        if ($result['count'] > 0) {
            $this->errors[$field] = ucfirst($field) . ' already exists';
        }
        
        return $this;
    }
    
    public function date($field) {
        if (isset($this->data[$field])) {
            $d = DateTime::createFromFormat('Y-m-d', $this->data[$field]);
            if (!$d || $d->format('Y-m-d') !== $this->data[$field]) {
                $this->errors[$field] = 'Invalid date format (YYYY-MM-DD required)';
            }
        }
        return $this;
    }
    
    public function fails() {
        return !empty($this->errors);
    }
    
    public function errors() {
        return $this->errors;
    }
    
    public function validated() {
        return $this->data;
    }
}
