import { generateToken, verifyToken } from '../../src/middleware/auth.middleware';
import { expect } from 'chai';

describe('Perfect Traffic Lights - Middleware Tests', () => {
  
  describe('Authentication Middleware', () => {
    
    it('should generate a valid JWT token', () => {
      const token = generateToken('user-123', 'test@example.com', 'user');
      expect(token).to.be.a('string');
      expect(token.split('.')).to.have.lengthOf(3);
    });

    it('should verify a valid token', () => {
      const token = generateToken('user-456', 'admin@example.com', 'admin');
      const decoded = verifyToken(token);
      
      expect(decoded).to.have.property('id', 'user-456');
      expect(decoded).to.have.property('email', 'admin@example.com');
      expect(decoded).to.have.property('role', 'admin');
    });

    it('should reject an invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      try {
        verifyToken(invalidToken);
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).to.include('Invalid or expired token');
      }
    });

    it('should generate different tokens for different users', () => {
      const token1 = generateToken('user-1', 'user1@test.com', 'user');
      const token2 = generateToken('user-2', 'user2@test.com', 'user');
      
      expect(token1).to.not.equal(token2);
    });
  });
});