-- Stored Procedures for User Management

-- 1. Create User
CREATE OR REPLACE FUNCTION sp_create_user(
    p_email VARCHAR(255),
    p_username VARCHAR(100),
    p_password_hash VARCHAR(255)
)
RETURNS TABLE (
    id UUID,
    email VARCHAR(255),
    username VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO users (email, username, password_hash)
    VALUES (p_email, p_username, p_password_hash)
    RETURNING users.id, users.email, users.username, users.created_at, users.updated_at;
END;
$$ LANGUAGE plpgsql;

-- 2. Get User by Email (for login)
CREATE OR REPLACE FUNCTION sp_get_user_by_email(
    p_email VARCHAR(255)
)
RETURNS TABLE (
    id UUID,
    email VARCHAR(255),
    username VARCHAR(100),
    password_hash VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT users.id, users.email, users.username, users.password_hash, users.created_at, users.updated_at
    FROM users
    WHERE users.email = p_email;
END;
$$ LANGUAGE plpgsql;

-- 3. Get User by ID
CREATE OR REPLACE FUNCTION sp_get_user_by_id(
    p_user_id UUID
)
RETURNS TABLE (
    id UUID,
    email VARCHAR(255),
    username VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT users.id, users.email, users.username, users.created_at, users.updated_at
    FROM users
    WHERE users.id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Get All Users (with pagination)
CREATE OR REPLACE FUNCTION sp_get_all_users(
    p_limit INTEGER DEFAULT 10,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    email VARCHAR(255),
    username VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    total_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        users.id,
        users.email,
        users.username,
        users.created_at,
        users.updated_at,
        COUNT(*) OVER() as total_count
    FROM users
    ORDER BY users.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql;

-- 5. Update User
CREATE OR REPLACE FUNCTION sp_update_user(
    p_user_id UUID,
    p_email VARCHAR(255) DEFAULT NULL,
    p_username VARCHAR(100) DEFAULT NULL,
    p_password_hash VARCHAR(255) DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    email VARCHAR(255),
    username VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    UPDATE users
    SET
        email = COALESCE(p_email, users.email),
        username = COALESCE(p_username, users.username),
        password_hash = COALESCE(p_password_hash, users.password_hash)
    WHERE users.id = p_user_id
    RETURNING users.id, users.email, users.username, users.created_at, users.updated_at;
END;
$$ LANGUAGE plpgsql;

-- 6. Delete User
CREATE OR REPLACE FUNCTION sp_delete_user(
    p_user_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM users WHERE id = p_user_id;
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count > 0;
END;
$$ LANGUAGE plpgsql;

-- 7. Check if email exists
CREATE OR REPLACE FUNCTION sp_email_exists(
    p_email VARCHAR(255)
)
RETURNS BOOLEAN AS $$
DECLARE
    email_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO email_count
    FROM users
    WHERE email = p_email;
    RETURN email_count > 0;
END;
$$ LANGUAGE plpgsql;

-- 8. Check if username exists
CREATE OR REPLACE FUNCTION sp_username_exists(
    p_username VARCHAR(100)
)
RETURNS BOOLEAN AS $$
DECLARE
    username_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO username_count
    FROM users
    WHERE username = p_username;
    RETURN username_count > 0;
END;
$$ LANGUAGE plpgsql;
